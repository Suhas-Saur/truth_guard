const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../tunnel_url.txt');

function startTunnel() {
  console.log('Starting persistent Serveo tunnel...');
  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=15',
    '-R', '80:127.0.0.1:3001',
    'serveo.net'
  ]);

  ssh.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);
    const match = text.match(/https:\/\/[a-zA-Z0-9._-]+\.serveousercontent\.com/);
    if (match) {
      fs.writeFileSync(logPath, match[0], 'utf-8');
      console.log('\n[ACTIVE_TUNNEL_URL]:', match[0], '\n');
    }
  });

  ssh.stderr.on('data', (data) => {
    const text = data.toString();
    process.stderr.write(text);
    const match = text.match(/https:\/\/[a-zA-Z0-9._-]+\.serveousercontent\.com/);
    if (match) {
      fs.writeFileSync(logPath, match[0], 'utf-8');
      console.log('\n[ACTIVE_TUNNEL_URL]:', match[0], '\n');
    }
  });

  ssh.on('close', (code) => {
    console.log(`Tunnel closed (code ${code}). Auto-reconnecting in 3s...`);
    setTimeout(startTunnel, 3000);
  });

  ssh.on('error', (err) => {
    console.error('SSH process error:', err.message);
    setTimeout(startTunnel, 5000);
  });
}

startTunnel();
