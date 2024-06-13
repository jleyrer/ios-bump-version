const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')

async function execCommand(command, options = {}) {
    const projectPath = core.getInput('project-path')
    options.cwd = projectPath
    return exec.exec(command, [], options)
}

async function run() {
    let version = core.getInput('version')

    if (version) {
        core.setOutput('version', version)

        const command = `agvtool new-marketing-version ${version}`
        console.log(command)
        await execCommand(command).catch(error => {
            core.setFailed(error.message)
        })
    } else {
        await execCommand(`agvtool what-marketing-version -terse1`, {
            listeners: { stdout: (data) => {
                console.log(data)
                core.setOutput('version', data.toString().trim())
            }}
        })
    }
}

run()