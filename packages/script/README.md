# @devim-clickhouse/script

Предоставляет возможность подключить на сайт аналитику ClickHouse с помощью скрипта.

## Использование

Добавьте на вашу страницу следующий код:

```html
<script type="text/javascript">
  var devimClickhouse = [
    {
      type: 'initialize',
      payload: {
        url: 'Полный адрес API',
        id: 'Уникальный идентификатор API',
      },
    },
  ];
</script>
```

Затем подключите сам скрипт:

```html
<script
  src="https://cdn.jsdelivr.net/npm/@devim-clickhouse/script/dist/index.min.js"
  defer
></script>
```

Теперь вы можете отправлять события в сервис с помощью следующего кода:

```js
devimClickhouse.push({
  type: 'eventName',
  payload: 'Optional payload for specified event',
  userId: 'Optional identificator of current user',
});
```
