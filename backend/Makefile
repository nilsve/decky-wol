# This is the default target, which will be built when
# you invoke make
.PHONY: all
all: backend

# This rule tells make how to build hello from hello.cpp
backend:
	mkdir -p ./out
	cargo build --release
	cp ./target/release/backend ./out/backend

# This rule tells make to delete hello and hello.o
.PHONY: clean
clean:
	rm -f hello