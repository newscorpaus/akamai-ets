PREFIX ?= /usr/local
VERSION = v5.3.0-1.0.0
SCOPE   = newscorpaus
NAME    = akamai-ets

all: install

install: build link

link:
	mkdir -p $(DESTDIR)$(PREFIX)/bin
	install -m 0755 ./files/$(NAME) $(DESTDIR)$(PREFIX)/bin/akamai-ets

uninstall:
	@$(RM) $(DESTDIR)$(PREFIX)/bin/$(NAME)
	@docker rmi ${SCOPE}/$(NAME):$(VERSION)
	@docker rmi ${SCOPE}/$(NAME):latest

build:
	npm install
	npm run build
	@docker build ./ -t ${SCOPE}/${NAME}:$(VERSION) -t ${SCOPE}/${NAME}:latest

# publish: build
# 	@docker push ${SCOPE}/${NAME}:$(VERSION):$(VERSION) \
# && docker push ${SCOPE}/${NAME}:$(VERSION):latest

.PHONY: all install uninstall build
