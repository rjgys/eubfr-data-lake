<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

- [Environment][1]
  - [Usage][2]
  - [Print][3]
  - [Generate][4]
- [Introduction][5]
  - [Usage][6]
- [Resources][7]
  - [Usage][8]
  - [Deploy][9]
  - [Delete][10]
- [Demo][11]
  - [Usage][12]
  - [Deploy][13]
  - [Delete][14]
- [Services][15]
  - [Usage][16]
  - [Deploy][17]
  - [Delete][18]
- [Content][19]
  - [Usage][20]
  - [Notes][21]
  - [Download][22]
  - [Upload][23]
  - [Show][24]
  - [Delete][25]
- [Elasticsearch][26]
  - [Usage][27]
  - [SnapshotExec][28]
  - [ShowDomains][29]
  - [ShowCluster][30]
  - [ShowIndices][31]
  - [CreateIndex][32]
  - [DeleteIndices][33]

## Environment

Manage environment

### Usage

```sh
$ eubfr-cli env -h
```

### Print

Display the values of the environment variables needed by the CLI.

Usage:

```sh
$ eubfr-cli env print
```

### Generate

The EUBFR CLI depends on a few environment variables which point to service API endpoints which are necessary for some commands to work.
For example, when you want to use commands related to content upload, the CLI will go to `@eubfr/storage-signed-uploads` service and seek for `SIGNED_UPLOADS_API` stored in `.env` file local to the service.
This endpoint is necessary for the CLI and other clients (client-side apps) to upload files to the data lake by signed uploads approach in AWS.
For this `.env` file to exist in the service, the serverless service itself has to be deployed on AWS in order for the cloud to generate information about the endpoint resulted out of the resource creation.
The `generate-variables` command helps you generate such `.env` files by re-uploading the serverless service (which you normally do by `npx sls deploy` from the folder of the service) and then running an export function. (which you usually do by `npx sls export-env`)

There are several services which require information from `.env` files, i.e. environment variables in overall.
These `.env` files are normally generated automatically for you when you deploy all services setting up your development environment.
However, if you receive an error for a missing environment variable, you can use this command to regenerate information about the necessary variables.

For instance, you may try to get information about available Elasticsearch domains which are manageable by the CLI running `eubfr-cli es`.
If you haven't deployed `@eubfr/demo-dashboard-client` or you have switched between staging environments working on different branches at the same code base, then you'll get an error like this:

    ENOENT: no such file or directory, open '.../eubfr-data-lake/demo/dashboard/client/.env'

Or it could be also any other message that hints for a requirement of a given named environment variable, such as `SIGNED_UPLOADS_API`.

These are signs that you need to re-generate all necessary `.env` files which contain information about the API endpoints.

Usage:

```sh
$ eubfr-cli env generate-variables
```

## Introduction

EUBFR CLI

Low-level utilities for managing assets of EUBFR data lake.

Please refer to [Getting Started guide][34] before jumping into using the utility.

Each command and sub-command has a help menu, which you can open by passing `-h` or `--help` flags without any arguments.

### Usage

```sh
$ eubfr-cli -h
```

## Resources

Manage resources

### Usage

```sh
$ eubfr-cli resources -h
```

### Deploy

Create all necessary AWS resources, such as S3 buckets for raw and harmonized storages.

Usage:

```sh
$ eubfr-cli resources deploy
```

### Delete

Delete resource services.

List: resources-raw-storage, resources-harmonized-storage.

Especially useful when usually resources-harmonized-storage will fail on deployment.

Usage:

```sh
$ eubfr-cli resources delete
```

## Demo

Manage demo applications

### Usage

```sh
$ eubfr-cli demo -h
```

### Deploy

Usage:

```sh
$ eubfr-cli demo deploy -h
```

Examples:

Deploy all demo applications for all producers.

```sh
$ eubfr-cli demo deploy
```

Deploy all services, only for working with the EAC producer.

```sh
$ eubfr-cli demo deploy -p eac
```

### Delete

Remove a demo application.

Usage:

```sh
$ eubfr-cli demo delete -h
```

Examples:

Delete all demo applications.

```sh
$ eubfr-cli demo delete
```

Delete only demo application of EAC producer.

```sh
$ eubfr-cli demo delete -p eac
```

## Services

Manage services

### Usage

```sh
$ eubfr-cli services -h
```

### Deploy

Usage:

```sh
$ eubfr-cli services deploy -h
```

Examples:

Deploy all services for all producers.

```sh
$ eubfr-cli services deploy
```

Deploy all services, only for working with the EAC producer.

```sh
$ eubfr-cli services deploy -p eac
```

(Re-)Deploy only a set of services for working a given producer.

```sh
$ eubfr-cli services deploy foo bar -p eac
```

### Delete

Remove a serverless service from AWS cloud.

Usage:

```sh
$ eubfr-cli services delete -h
```

Examples:

Delete all services.

```sh
$ eubfr-cli services delete
```

Delete only a given set of services.

```sh
$ eubfr-cli services delete storage-signed-uploads storage-deleter
```

## Content

Manage content

### Usage

```sh
$ eubfr-cli content -h
```

### Notes

The [eubfr-content][35] S3 bucket is a central content repository which holds files which could be ingested by the data lake.

Content is a core resource for the data lake, and although it's not required to have it while working with the project, it's highly recommended that you have a local copy to work faster.

You can clone the content repository locally in several ways:

With the AWS CLI:

```sh
$ mkdir .content && aws s3 sync s3://eubfr-content ./.content
```

With the EUBFR CLI:

```sh
$ eubfr-cli content download --confirm
```

With the Yarn CLI (abstracted commands to EUBFR CLI)

```sh
$ yarn content:download
```

To see more abstracted project-level operations related to content:

```sh
$ yarn run | grep content
```

### Download

Get all necessary files for the data lake from a content repository.

This command depends on an environment variable `EUBFR_CONTENT_REPOSITORY`.
It's the name of the S3 bucket which is the content repository.

Usage:

```sh
$ eubfr-cli content download -h
```

Examples:

Get only the files necessary to work with AGRI producer.

```sh
$ eubfr-cli content download -p agri
```

Download files in a specific folder if the script does not have permissions to write in default `.content`.

```sh
$ eubfr-cli content download -f /tmp
```

Download all files for all producers in default `.content` folder without interactions.

```sh
$ eubfr-cli content download --confirm
```

Download files and override existing.

```sh
$ eubfr-cli content download --override
```

### Upload

Upload content to the data lake.

Usage:

```sh
$ eubfr-cli content upload -h
```

Examples:

Single file:

```sh
$ eubfr-cli content upload .content/eac/CreativeEurope_Projects_Overview.csv -p eac
```

Multiple files:

```sh
$ eubfr-cli content upload .content/inforegio/EUBFR_VIEW_16052018.xml .content/inforegio/regio_projects.json -p inforegio
```

All files:

```sh
$ eubfr-cli content upload
```

### Show

Display files of a given producer.

Usage:

```sh
$ eubfr-cli content show -h
```

Examples:

Specific file by `computed_key`:

```sh
$ eubfr-cli content show eac/16598a36-db86-42a0-8041-c0d85021ad97.csv
```

All files of a given producer:

```sh
$ eubfr-cli content show -p eac
```

Please note that if you are sure there's an existing content,
but you can't see it with this command, you'll need to double-check
`eubfr-data-lake/demo/dashboard/client/.env` file to contain
the correct value for `REACT_APP_STAGE`.
If it's not the same as config.json's `stage`, run
`eubfr-cli env generate-variables` to refresh the value of `REACT_APP_STAGE`.

### Delete

Delete files by `computed_key` field.

Usage:

```sh
$ eubfr-cli content delete -h
```

Examples:

Delete one or multiple files:

```sh
$ eubfr-cli content delete eac/foo cordis/bar inforegio/baz
```

Delete all files of all producers:

```sh
$ eubfr-cli content delete
```

By default, you will be prompted to confirm your intention.
You can skip the this prompt by adding `--confirm` flag.

## Elasticsearch

Manage Elasticsearch assets

### Usage

```sh
$ eubfr-cli es -h
```

### SnapshotExec

- **See: [https://www.elastic.co/guide/en/elasticsearch/reference/6.3/modules-snapshots.html][36]**
- **See: [https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-snapshot-create-6-2][37]**

Abstracted utility for making use of `snapshot` methods of ES JS SDK

Useful for making backups of indices, such as `.kibana`.

There are a few good reasons why you would want to use EUBFR CLI:

- it knows how to find and use your AWS credentials automatically.
- it provides useful defaults where necessary: such as working with S3 for storage.
- it knows about specific AWS resources which you shouldn't bother to know: S3 backup bucket name, assumed service role arn, etc.
- it also makes a setup of connecting Amazon ES with AWS JS SDK with `http-aws-es`, so all authentication is handled for you.

You could, of course, setup clients and authentication yourself, this command is meant to help you be more productive.

Usage:

```sh
$ eubfr-cli es snapshot-exec -h
```

Examples:

Create a repository:

Note that the integration with S3 has been setup, `body` of request is prepared for you.

```sh
$ eubfr-cli es snapshot-exec createRepository --host https://es.domain/ --params '{ "repository": "repo_name", "verify": true }'
```

Get information about specific repositories:

```sh
$ eubfr-cli es snapshot-exec getRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
```

Delete a given repository:

```sh
$ eubfr-cli es snapshot-exec deleteRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
```

Verify a given repository:

```sh
$ eubfr-cli es snapshot-exec verifyRepository --host https://es.domain/ --params '{ "repository": "repo_name" }'
```

Create a snapshot:

```sh
$ eubfr-cli es snapshot-exec create --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
```

Get a snapshot:

```sh
$ eubfr-cli es snapshot-exec get --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
```

Get status of a given snapshot:

```sh
$ eubfr-cli es snapshot-exec status --host https://es.domain/ --params '{ "repository": "repo_name", "snapshot": "snap1" }'
```

### ShowDomains

Display a list of manageable domains.

Usage:

```sh
$ eubfr-cli es show-domains
```

Useful when you want to see the names of the Elasticsearch domains available for management throught the EUBFR CLI.
This will give you information about the named environment variables holding information about their corresponding hosts. (API endpoints)

### ShowCluster

Display cluster information about a given domain.

Usage:

```sh
$ eubfr-cli es show-cluster
```

Once you have the basic information about the domains you can manage through the CLI.

Examples:

```sh
$ eubfr-cli es show-cluster -d REACT_APP_ES_PUBLIC_ENDPOINT
```

### ShowIndices

Display index information.

Usage:

```sh
$ eubfr-cli es show-indices -h
```

This could be useful when you want to query for existing indices so that you either re-use or re-create.

Examples:

```sh
$ eubfr-cli es show-indices -d REACT_APP_ES_PUBLIC_ENDPOINT
```

Since output might be too long to read (and most probably it will be in `dev` stage which is shared between developers), it could help to pipe a `grep` in order to focus on more narrow list.

```sh
 $ eubfr-cli es show-indices -d REACT_APP_ES_PUBLIC_ENDPOINT | grep chernka
```

This will give you a list of existing indices created by the given user. Then, you can make a more narrow query by specifying an index as following:

```sh
$ eubfr-cli es show-indices user-index-1 user-index-2 etc -d REACT_APP_ES_PUBLIC_ENDPOINT
```

### CreateIndex

Create an index in a given domain with an optional mapping.

Usage:

```sh
$ eubfr-cli es create-index -h
```

Used either when creating a new index with a free structure (no mapping rules) or when creating a new index with specific rules about the document structure.

Simply create a new index:

```sh
$ eubfr-cli es create-index user-index-1 -d REACT_APP_ES_PUBLIC_ENDPOINT
```

Create a new index with mapping:

```sh
$ eubfr-cli es create-index user-index-1 -t project -m ./resources/elasticsearch/mappings/project.js -d REACT_APP_ES_PUBLIC_ENDPOINT
```

This is especially useful when you want to update mapping for a given index without re-creating the whole domain.

### DeleteIndices

Delete indices from a given Elasticsearch domain.

Usage:

```sh
$ eubfr-cli es delete-indices -h
```

This could be useful when you want to change mapping of an index without re-creating the whole domain.

```sh
$ eubfr-cli es delete-indices user-index-1 -d REACT_APP_ES_PUBLIC_ENDPOINT
```

If you would like to skip the confirmation, you can use the `--confirm` flag:

```sh
$ eubfr-cli es delete-indices user-index-1 --confirm -d REACT_APP_ES_PUBLIC_ENDPOINT
```

Skipping the `user-index-1` will delete all indices in the given domain, so be extra careful with this command.

[1]: #environment
[2]: #usage
[3]: #print
[4]: #generate
[5]: #introduction
[6]: #usage-1
[7]: #resources
[8]: #usage-2
[9]: #deploy
[10]: #delete
[11]: #demo
[12]: #usage-3
[13]: #deploy-1
[14]: #delete-1
[15]: #services
[16]: #usage-4
[17]: #deploy-2
[18]: #delete-2
[19]: #content
[20]: #usage-5
[21]: #notes
[22]: #download
[23]: #upload
[24]: #show
[25]: #delete-3
[26]: #elasticsearch
[27]: #usage-6
[28]: #snapshotexec
[29]: #showdomains
[30]: #showcluster
[31]: #showindices
[32]: #createindex
[33]: #deleteindices
[34]: ./docs/GETTING_STARTED.md
[35]: https://s3.console.aws.amazon.com/s3/buckets/eubfr-content/?region=eu-central-1&tab=overview
[36]: https://www.elastic.co/guide/en/elasticsearch/reference/6.3/modules-snapshots.html
[37]: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-6-2.html#api-snapshot-create-6-2
