const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../tunnel_url.txt');

function startTunnel() {
  console.log('Starting resilient Serveo tunnel...');
  
  const ssh = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=10',
    '-o', 'ServerAliveCountMax=3',
    '-R', '80:127.0.0.1:3000',
    'serveo.net'
  ]);

  const handleOutput = (data) => {
    const text = data.toString();
    process.stdout.write(text);

    const match = text.match(/https:\/\/[a-zA-Z0-9._-]+\.serveousercontent\.com/);
    if (match) {
      const activeUrl = match[0];
      fs.writeFileSync(logPath, activeUrl, 'utf-8');
      console.log('\n========================================');
      console.log('  [TRUTHGUARD LIVE URL]:', activeUrl);
      console.log('========================================\n');
    }
  };

  ssh.stdout.on('data', handleOutput);
  ssh.stderr.on('data', handleOutput);

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
