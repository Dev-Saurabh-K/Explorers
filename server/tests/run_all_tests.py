import os
import sys
import subprocess

test_files = [
    "tests/test_knowledge_routes.py",
    "tests/test_ai_categorization_integration.py",
    "tests/test_caching_and_sync.py",
]


def run_tests():
    env = os.environ.copy()
    env["PYTHONPATH"] = "."

    all_passed = True
    for test_file in test_files:
        print(f"\n==========================================")
        print(f"Running {test_file}...")
        print(f"==========================================")
        result = subprocess.run([sys.executable, test_file], env=env)
        if result.returncode != 0:
            print(f"FAILED: {test_file}")
            all_passed = False
        else:
            print(f"PASSED: {test_file}")

    if all_passed:
        print("\n==========================================")
        print("ALL TESTS PASSED SUCCESSFULLY!")
        print("==========================================")
        sys.exit(0)
    else:
        print("\n==========================================")
        print("SOME TESTS FAILED.")
        print("==========================================")
        sys.exit(1)


if __name__ == "__main__":
    run_tests()
