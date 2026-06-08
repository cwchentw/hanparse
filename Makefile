ifeq ($(OS),Windows_NT)
	RMDIR := rmdir /s /q
else
	RMDIR := rm -rf
endif

SRCDIR := src
OUTDIR := dist
ENTRY := src/hanparse.ts
TSC := bunx tsc
ESBUILD := bunx esbuild

.PHONY: all build release debug smoke demo types typecheck json-minify proper-noun clean

all: release

build: typecheck
	$(TSC) -p tsconfig.json

release: json-minify proper-noun types typecheck
	$(ESBUILD) $(ENTRY) --outdir=$(OUTDIR) --format=esm --minify --bundle \
		--external:./rules.json --external:./proper-noun.json

debug: build

smoke: release
	bun test/hanparse.smoke.js

demo: release
	bun test/hanparse.demo.js

types:
	$(TSC) --emitDeclarationOnly

typecheck:
	$(TSC) --noEmit -p tsconfig.json

json-minify:
	./json-minify

proper-noun:
	mkdir -p $(OUTDIR)
	./convert > $(OUTDIR)/proper-noun.json

clean:
	$(RMDIR) $(OUTDIR)