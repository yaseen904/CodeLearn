import { execFile } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

const LANGUAGE_CONFIG = {
  java: {
    image: 'eclipse-temurin:21-jdk-alpine',
    fileName: 'Main.java',
    command: 'javac Main.java && java Main'
  },

  python: {
    image: 'python:3.12-alpine',
    fileName: 'main.py',
    command: 'python main.py'
  },

  javascript: {
    image: 'node:22-alpine',
    fileName: 'main.js',
    command: 'node main.js'
  },

  cpp: {
    image: 'gcc:14',
    fileName: 'main.cpp',
    command: 'g++ -std=c++17 -O2 main.cpp -o main && ./main'
  }
};

const runDocker = (args, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    execFile(
      'docker',
      args,
      {
        timeout,
        maxBuffer: 1024 * 1024,
        windowsHide: true
      },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            status: error.killed ? 'TLE' : 'RE',
            stdout: stdout || '',
            stderr: stderr || error.message
          });
          return;
        }

        resolve({
          status: 'OK',
          stdout: stdout || '',
          stderr: stderr || ''
        });
      }
    );
  });
};

const executeCode = async (language, code, stdin = '') => {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), `codelearn-${crypto.randomUUID()}-`)
  );

  try {
    const sourcePath = path.join(tempDir, config.fileName);

    await fs.writeFile(sourcePath, code, 'utf8');

    const args = [
      'run',
      '--rm',

      // No internet access
      '--network',
      'none',

      // Resource limits
      '--memory',
      '256m',

      '--cpus',
      '1',

      '--pids-limit',
      '64',

      // Temporary writable filesystem
      '--tmpfs',
      '/tmp:rw,nosuid,size=64m',

      // Mount user's source code
      '-v',
      `${tempDir}:/workspace`,

      '-w',
      '/workspace',

      config.image,

      'sh',
      '-c',
      config.command
    ];

    const containerResult = await runDocker(args);

    // If the program executed successfully, run it again with stdin
    // for languages where input is required.
    if (containerResult.status === 'OK' && stdin) {
      const inputArgs = [
        'run',
        '--rm',
        '--network',
        'none',
        '--memory',
        '256m',
        '--cpus',
        '1',
        '--pids-limit',
        '64',
        '--tmpfs',
        '/tmp:rw,nosuid,size=64m',
        '-v',
        `${tempDir}:/workspace`,
        '-w',
        '/workspace',
        '-i',
        config.image,
        'sh',
        '-c',
        config.command
      ];

      return await runDockerWithInput(inputArgs, stdin);
    }

    return containerResult;

  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true
    });
  }
};

const runDockerWithInput = (args, stdin) => {
  return new Promise((resolve) => {
    const child = execFile(
      'docker',
      args,
      {
        timeout: 10000,
        maxBuffer: 1024 * 1024,
        windowsHide: true
      },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            status: error.killed ? 'TLE' : 'RE',
            stdout: stdout || '',
            stderr: stderr || error.message
          });
          return;
        }

        resolve({
          status: 'OK',
          stdout: stdout || '',
          stderr: stderr || ''
        });
      }
    );

    child.stdin?.write(stdin);
    child.stdin?.end();
  });
};

export default {
  executeCode
};