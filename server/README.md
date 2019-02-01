# gcloud

## gcloud app config

app.sample.yaml -> app.yaml

```yaml
runtime: nodejs8
env_variables:
    PORT: 3000
    DB_HOST:
    DB_USER:
    DB_PASS:
    DB_NAME:
```

## gcloud commands

### login
```sh
gcloud auth login
```

### set project
```sh
gcloud config set project xxxxxxxxxx
```

### logs
```sh
gcloud app logs tail -s default
```

### deploy
```sh
gcloud preview app deploy
```

### browse up
```sh
gcloud app browse
```

