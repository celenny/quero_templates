const PYTHON = process.platform === "win32"
  ? ".\\.venv\\Scripts\\python"
  : "./.venv/bin/python";

export default PYTHON;