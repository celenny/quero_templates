const { promisify } = require('util');
const { exec, spawn } = require('child_process');

const asyncExec = promisify(exec);

async function createVirtualEnvironment() {
  try {
    const createVenvCommand = 'python -m venv .venv';

    const { stdout, stderr } = await asyncExec(createVenvCommand);
    console.log('Virtual environment created successfully');
  } catch (error) {
    console.error(`Error creating virtual environment: ${error.message}`);
  }
}

async function installRequirements() {
  try {
    const installRequirementsCommand = process.platform === "win32"
      ? '.\\.venv\\Scripts\\pip install -r requirements.txt' 
      : './.venv/bin/pip install -r requirements.txt';

      const installProcess = spawn(installRequirementsCommand, { shell: true });

      installProcess.stdout.on('data', (data) => {
        process.stdout.write(`${data}`);
      });

      installProcess.stderr.on('data', (data) => {
        process.stderr.write(`${data}`);
      });

      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Requirements installed successfully');
        } else {
          console.error(`Error installing requirements. Exit code: ${code}`);
        }
      });
  } catch (error) {
    console.error(`Error installing requirements: ${error.message}`);
  }
}

async function setup() {
  await createVirtualEnvironment();
  await installRequirements();
}

setup();
