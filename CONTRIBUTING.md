# Contributing to ngx-turnstile

Thank you for contributing to ngx-turnstile 🎉 Any contributions to ngx-turnstile are appreciated and encouraged.

## Code of Conduct

This project and everyone that is participating in it is governed by the [Code of Conduct](https://github.com/verto-health/ngx-turnstile/blob/main/CODE_OF_CONDUCT.md) document.
By participating, you are expected to uphold this code. Please report unacceptable behaviour to
cyong@verto.ca or abodurri@verto.ca.

## How to contribute

### Creating issues

Before submitting issues, please have a quick look if there is an existing open issue here: [Issues](https://github.com/verto-health/ngx-turnstile/issues).
If no related issue can be found, please open a new issue with labels: `bug`, `documentation`, `enhancement` or `question`.

### Opening pull requests

Pull requests are more than welcome! Just make sure that to include a description of the problem and how you
are attempting to fix the issue, or simply follow the Pull Request description template.

We also require Pull Requests to sync with master via rebase (not merge). So when you need to sync up your
branch with master use: `git pull --rebase origin master`, or if you need to sync up with another
branch `git pull --rebase origin some-other-branch-name`. Doing so will remove of an extra merge commit in the git history.
This will also require a force push to the branch, e.g. git push -u origin +some-branch. The + in the last command indicates
that you are force pushing changes.

Additionally, we require commits to be atomic and squashed where needed.
This will keep the git history clean on master. To squash commits use the `git rebase -i @~2` command to do an interactive
rebase. This will allow you to merge multiple commits into one.
To read up more on this please visit: [Git Tools Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
