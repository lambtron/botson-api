
#
# Default.
#

default: server

#
# Tasks.
#

# Install Emojipacks on your machine.
install: node_modules

# Install node modules with npm.
node_modules: package.json
	@npm install
	@touch node_modules

# Run server.
server:
	@npm start

# Clean dependencies.
clean:
	@rm -rf ./node_modules

#
# Phonies.
#

.PHONY: install
.PHONY: clean
.PHONY: server