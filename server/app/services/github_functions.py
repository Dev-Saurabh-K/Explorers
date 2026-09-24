from github import Github

def get_latest_repos(token):
    g = Github(token)
    # Sort by last push (most recent commit activity)
    repos = g.get_user().get_repos(sort="pushed", direction="desc")
    return [repo.full_name for repo in repos]

# repo_name : owner/repo
def get_repo_commits(token, repo_name):
    g = Github(token)

    repo =  g.get_repo(repo_name)

    commits = repo.get_commits()

    results = []
    for commit in commits:
        results.append({
            "sha": commit.sha, # type: ignore
            "message": commit.commit.message, # type: ignore
            "author": commit.commit.author.name, # type: ignore
            "date": commit.commit.author.date.isoformat() # type: ignore
        })

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

    # Filter commits by author login
    commits = repo.get_commits(author=contributor)

    results = []
    for commit in commits:
        results.append({
            "sha": commit.sha,
            "message": commit.commit.message,
            "date": commit.commit.author.date.isoformat()
        })

    return results



