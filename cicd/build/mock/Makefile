# Makefile

.PHONY: all install build release run-local

DATE = $(shell date +%Y%m%d)
REPO = 875809720787.dkr.ecr.us-east-1.amazonaws.com
IMAGE = aurora/new-aurora-candidate-webapp-mock
TAG ?= latest # take from make params, default = latest
LOCAL_PORT = 8088

all:
	@echo "Available targets:"
	@echo "  * install   - install dependences"
	@echo "  * build     - build image $(REPO)/$(IMAGE):$(TAG)"
	@echo "  * release   - build and push to $(REPO)"
	@echo "  * run-local - run application on local port $(LOCAL_PORT)"

install: deps
	echo "install..."

deps:
	echo "no deps..."

build: deps
	docker build -t $(IMAGE):$(TAG) -f Dockerfile ../../../

release: build
	docker tag $(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

run-local:
	docker run --rm -p $(LOCAL_PORT):80 $(IMAGE):$(TAG)
