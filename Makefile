ifeq ($(OS),Windows_NT)
	RMDIR := rmdir /s /q
else
	RMDIR := rm -rf
endif

OUTDIR := dist
ENTRY := src/hanparse.ts
TSC := bunx tsc
ESBUILD := bunx esbuild

.PHONY: all build release debug smoke demo types typecheck clean

all: build

build: typecheck
	$(TSC) -p tsconfig.json

release: types typecheck
	$(ESBUILD) $(ENTRY) --outdir=$(OUTDIR) --format=esm --minify

debug: build

smoke: build
	bun test/hanparse.smoke.js

demo: build
	bun test/hanparse.demo.js

types:
	$(TSC) --emitDeclarationOnly

typecheck:
	$(TSC) --noEmit -p tsconfig.json

clean:
	$(RMDIR) $(OUTDIR)