import $ from 'jquery'

export function getFixture() {
  return document.getElementById('qunit-fixture')
}

export function setFixture(html) {
  const fixture = getFixture()
  if (fixture) {
    fixture.innerHTML = html
  }
}

export function clearFixture() {
  const fixture = getFixture()
  if (!fixture) {
    return
  }

  // Remove any leftover jQuery event handlers on descendants before clearing.
  const descendants = fixture.querySelectorAll('*')
  for (const element of descendants) {
    $(element).off()
  }

  fixture.innerHTML = ''
}
