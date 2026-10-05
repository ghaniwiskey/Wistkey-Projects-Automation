// Playwright reporter that streams machine-readable progress lines ("@@qa {json}") to stdout.
// Enabled by playwright.config.js when QA_LIVE=1 (the web app sets it for runs it starts).
const ID_RE = /^\s*([A-Z][A-Z0-9]*-\d+)\b/;
const idOf = (test) => (ID_RE.exec(test.title) || [])[1] || test.title;
const emit = (obj) => process.stdout.write('@@qa ' + JSON.stringify(obj) + '\n');
const firstLine = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '').split('\n').find((l) => l.trim()) || '';

export default class LiveReporter {
  printsToStdio() {
    return false;
  }

  onBegin(config, suite) {
    const tests = suite.allTests().map((t) => ({ id: idOf(t), title: t.title, project: t.parent.project()?.name }));
    emit({ type: 'begin', total: tests.length, tests, workers: config.workers });
  }

  onTestBegin(test, result) {
    emit({ type: 'testBegin', id: idOf(test), project: test.parent.project()?.name, retry: result.retry });
  }

  onTestEnd(test, result) {
    emit({
      type: 'testEnd', id: idOf(test), project: test.parent.project()?.name, status: result.status, retry: result.retry,
      durationMs: result.duration, outcome: test.outcome(), error: result.error ? firstLine(result.error.message) : undefined,
    });
  }

  onError(error) {
    emit({ type: 'error', message: firstLine(error.message || error.value) });
  }

  onEnd(result) {
    emit({ type: 'end', status: result.status, durationMs: result.duration });
  }
}
