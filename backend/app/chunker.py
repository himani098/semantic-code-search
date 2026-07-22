import ast
import os

def chunk_python_file(filepath):
    """Extract functions and classes from a Python file as separate chunks."""
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        source = f.read()

    try:
        tree = ast.parse(source)
    except SyntaxError:
        return []  # skip files that don't parse

    chunks = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start = node.lineno - 1
            end = getattr(node, "end_lineno", start + 1)
            lines = source.splitlines()[start:end]
            code_text = "\n".join(lines)
            chunks.append({
                "name": node.name,
                "type": type(node).__name__,
                "code": code_text,
                "file": filepath,
                "start_line": node.lineno,
            })
    return chunks

def get_python_files(repo_path):
    files = []

    for root, _, filenames in os.walk(repo_path):

        if any(skip in root for skip in [".git", "venv", "__pycache__", "node_modules"]):
            continue

        for filename in filenames:
            if filename.endswith(".py"):
                files.append(os.path.join(root, filename))

    return files

def chunk_repo(repo_path):
    """Walk through a repo and chunk every .py file."""
    all_chunks = []
    for root, _, files in os.walk(repo_path):
        # skip virtual envs, git folders, node_modules etc.
        if any(skip in root for skip in [".git", "venv", "__pycache__", "node_modules"]):
            continue
        for file in files:
            if file.endswith(".py"):
                filepath = os.path.join(root, file)
                all_chunks.extend(chunk_python_file(filepath))
    return all_chunks