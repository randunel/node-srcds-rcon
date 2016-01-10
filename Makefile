# TESTS

TESTER = ./node_modules/.bin/mocha
OPTS = --growl --ignore-leaks --timeout 30000
TESTS = test/*.test.js
INTEGRATION = test/*.integration.js
JSHINT = ./node_modules/.bin/jshint

JS_FILES = $(shell find . -type f -name "*.js" \
					 -not -path "./node_modules/*" -and \
					 -not -path "./broker/*" -and \
					 -not -path "./coverage/*" -and \
					 -not -path "./dev/*" -and \
					 -not -path "./vendor/*" -and \
					 -not -path "./broker/*" -and \
					 -not -path "./public/_js/*" -and \
					 -not -path "./config/database.js" -and \
					 -not -path "./public/js/*.js" -and \
					 -not -path "./newrelic.js" -and \
					 -not -path "./db/schema.js")

check:
	@$(JSHINT) $(JS_FILES) && echo 'Those who know do not speak. Those who speak do not know.'

test:
	$(TESTER) $(OPTS) $(TESTS)
test-verbose:
	$(TESTER) $(OPTS) --reporter spec $(TESTS)
test-integration:
	$(TESTER) $(OPTS) --reporter spec $(INTEGRATION)
test-full:
	$(TESTER) $(OPTS) --reporter spec $(TESTS) $(INTEGRATION)
testing:
	$(TESTER) $(OPTS) --watch $(TESTS)
features:
	NODE_ENV=test node_modules/.bin/cucumber.js

.PHONY: test doc docs features

