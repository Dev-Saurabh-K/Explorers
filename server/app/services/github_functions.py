from github import Github

def get_latest_repos(token):
    g = Github(token)
    # Sort by last push (most recent commit activity)
    repos = g.get_user().get_repos(sort="pushed", direction="desc")
    return [repo.full_name for repo in repos]

def get_repo_commits(token, repo_name, limit: int | None = None):
    g = Github(token)

    repo = g.get_repo(repo_name)

    commits = repo.get_commits()

    results = []
    for commit in commits:
        author_name = commit.author.login if commit.author else (
            commit.commit.author.name if commit.commit and commit.commit.author else "Unknown"
        )
        avatar_url = commit.author.avatar_url if commit.author else None
        date_str = (
            commit.commit.author.date.isoformat()
            if commit.commit and commit.commit.author and commit.commit.author.date
            else ""
        )
        results.append({
            "sha": commit.sha,
            "message": commit.commit.message if commit.commit else "",
            "author": author_name,
            "avatar_url": avatar_url,
            "date": date_str
        })
        if limit and len(results) >= limit:
            break

    return results


def get_commits_by_shas(token: str, repo_name: str, commit_shas: list[str]) -> list[dict]:
    """
    Fetch lightweight commit author and metadata for specific commit SHAs.
    """
    g = Github(token)
    repo = g.get_repo(repo_name)
    results = []
    for sha in commit_shas:
        try:
            commit = repo.get_commit(sha)
            author_name = commit.author.login if commit.author else (
                commit.commit.author.name if commit.commit and commit.commit.author else "Unknown"
            )
            avatar_url = commit.author.avatar_url if commit.author else None
            date_str = (
                commit.commit.author.date.isoformat()
                if commit.commit and commit.commit.author and commit.commit.author.date
                else ""
            )
            results.append({
                "sha": commit.sha,
                "message": commit.commit.message if commit.commit else "",
                "author": author_name,
                "avatar_url": avatar_url,
                "date": date_str
            })
        except Exception:
            continue
    return results

def get_commit_authors(token, repo_name, limit=None):
    g = Github(token)
    repo = g.get_repo(repo_name)

    commits = repo.get_commits()
    authors = {}

    count = 0
    for commit in commits:
        if commit.author:  # Linked GitHub user
            authors[commit.author.login] = commit.author.avatar_url
        else:
            # Fallback: only name available, no avatar
            authors[commit.commit.author.name] = None

        count += 1
        if limit and count >= limit:
            break

    # Convert dict to list of dicts for clarity
    results = [{"username": user, "avatar_url": url} for user, url in authors.items()]
    return results

def get_commits_by_contributer(token, repo_name, contributor):
    g = Github(token)
    repo = g.get_repo(repo_name)
    results = []

    # 1. Try filtering by author handle via GitHub API
    try:
        commits = repo.get_commits(author=contributor)
        for commit in commits:
            date_str = ""
            if commit.commit and commit.commit.author and commit.commit.author.date:
                date_str = commit.commit.author.date.isoformat()
            results.append({
                "sha": commit.sha,
                "message": commit.commit.message if commit.commit else "",
                "date": date_str
            })
            if len(results) >= 50:
                break
    except Exception:
        results = []

    # 2. If empty, check recent repository commits matching username or name
    if not results:
        try:
            target = contributor.strip().lower()
            all_commits = repo.get_commits()
            count = 0
            for commit in all_commits:
                login = (commit.author.login if commit.author else "").lower()
                author_name = (commit.commit.author.name if commit.commit and commit.commit.author else "").lower()
                if target == login or target in login or target in author_name or author_name in target:
                    date_str = ""
                    if commit.commit and commit.commit.author and commit.commit.author.date:
                        date_str = commit.commit.author.date.isoformat()
                    results.append({
                        "sha": commit.sha,
                        "message": commit.commit.message if commit.commit else "",
                        "date": date_str
                    })
                    if len(results) >= 50:
                        break
                count += 1
                if count >= 100:
                    break
        except Exception:
            pass

    return results


def get_feature_diff_context(token: str, repo_name: str, commit_shas: list[str], max_patch_chars: int = 4000) -> dict:
    """
    Given a list of commit SHAs belonging to a feature, extracts changed files, commit messages, and diff patches.
    Filters binary files and lockfiles to preserve LLM token context.
    """
    g = Github(token)
    repo = g.get_repo(repo_name)

    IGNORE_EXTENSIONS = {
        '.lock', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pyc',
        '.exe', '.pdf', '.min.js', '.map', '.ico', '.woff', '.woff2', '.ttf'
    }
    IGNORE_FILES = {'uv.lock', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'app.db'}

    files_impacted: dict[str, dict] = {}
    commit_details: list[dict] = []

    for sha in commit_shas:
        try:
            commit = repo.get_commit(sha)
        except Exception:
            continue

        author_name = commit.commit.author.name if commit.commit and commit.commit.author else "Unknown"
        author_date = commit.commit.author.date.isoformat() if commit.commit and commit.commit.author and commit.commit.author.date else ""
        commit_message = commit.commit.message if commit.commit else ""

        commit_details.append({
            "sha": commit.sha[:7],
            "message": commit_message,
            "author": author_name,
            "date": author_date
        })

        if not commit.files:
            continue

        for file in commit.files:
            filename = file.filename

            # Skip noise files or lockfiles
            if any(filename.endswith(ext) for ext in IGNORE_EXTENSIONS) or filename in IGNORE_FILES:
                continue

            patch = file.patch or ""
            if len(patch) > max_patch_chars:
                patch = patch[:max_patch_chars] + "\n...[truncated]"

            if filename not in files_impacted:
                files_impacted[filename] = {
                    "filename": filename,
                    "status": file.status,
                    "additions": file.additions or 0,
                    "deletions": file.deletions or 0,
                    "patch": patch
                }
            else:
                files_impacted[filename]["additions"] += file.additions or 0
                files_impacted[filename]["deletions"] += file.deletions or 0
                if patch:
                    files_impacted[filename]["patch"] += f"\n\n--- Commit {commit.sha[:7]} Patch ---\n" + patch

    return {
        "commits": commit_details,
        "files": list(files_impacted.values())
    }




