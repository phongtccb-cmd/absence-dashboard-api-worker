# absence-dashboard-api-worker

Worker API trung gian cho dashboard vang mat lanh dao.

## Kiem tra sau deploy

Mo URL Worker:

```text
https://absence-dashboard-api.phongtccb.workers.dev/
```

Neu dung se thay JSON co `"ok": true`.

## Bien moi truong tuy chon

```text
APPS_SCRIPT_DASHBOARD_API_URL
```

Neu khong khai bao, Worker dung fallback Apps Script URL trong `src/index.js`.
