const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_DIR = '.mentor/logs';
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function getLatestSession() {
    const list = JSON.parse(execSync('opencode session list --json').toString());
    return list[list.length - 1];
}

function archive() {
    const session = getLatestSession();
    console.log(`Archiving session: ${session.id} (${session.title || 'No Title'})`);

    const rawData = execSync(`opencode export ${session.id} --sanitize`).toString();
    const sessionData = JSON.parse(rawData);

    const filename = `session_${session.id}_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(path.join(LOG_DIR, filename), JSON.stringify(sessionData, null, 2));

    console.log(`Session saved to ${path.join(LOG_DIR, filename)}`);
    console.log('Use /archive to generate a summary from this session.');
}

archive();
