const fs = require('fs');

try {
    const tmpPath = 'test.tmp';
    const filePath = 'test.json';
    fs.writeFileSync(tmpPath, 'hello', 'utf-8');

    // Ensure data is written to disk
    const fd = fs.openSync(tmpPath, 'r');
    fs.fsyncSync(fd);
    fs.closeSync(fd);

    // Atomic replace
    fs.renameSync(tmpPath, filePath);
    console.log("Success");
} catch (e) {
    console.log("Failed:", e.message);
}
