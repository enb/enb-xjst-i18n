enb-xjst-i18n
============

[![NPM version](https://img.shields.io/npm/v/enb-xjst-i18n.svg?style=flat)](https://www.npmjs.org/package/enb-xjst-i18n)
[![Build Status](https://img.shields.io/travis/enb-bem/enb-xjst-i18n/master.svg?style=flat&label=tests)](https://travis-ci.org/enb-bem/enb-xjst-i18n)
[![Build status](https://img.shields.io/appveyor/ci/blond/enb-xjst-i18n.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/enb-xjst-i18n)
[![Coverage Status](https://img.shields.io/coveralls/enb-bem/enb-xjst-i18n.svg?style=flat)](https://coveralls.io/r/enb-bem/enb-xjst-i18n?branch=master)
[![devDependency Status](https://img.shields.io/david/enb-bem/enb-xjst-i18n.svg?style=flat)](https://david-dm.org/enb-bem/enb-xjst-i18n)

Поддержка `BEM.I18N` для ENB.

Установка:
----------

```
npm install --save-dev enb-xjst-i18n
```

Для работы модуля требуется зависимость от пакета `enb` версии `0.11.0` или выше.

Технологии
----------

* [bemhtml-i18n](#bemhtml-i18n)

### bemhtml-i18n

Собирает `?.bemhtml.<язык>.js`-файлы на основе `?.keysets.<язык>.js`-файла и исходных шаблонов.

Склеивает *bemhtml.xjst* и *bemhtml*-файлы по deps'ам, обрабатывает `xjst` -транслятором,  сохраняет (по умолчанию) в виде `?.bemhtml.js`.

**Опции**

* *String* **target** — Результирующий таргет. По умолчанию — `?.bemhtml.js`.
* *String* **lang** — Язык, для которого небходимо собрать файл.
* *String* **keysetsFile** — Исходный keysets-файл. По умолчанию — `?.keysets.{lang}.js`.
* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов (его предоставляет технология `files`). По умолчанию — `?.files`.
* *String* **sourceSuffixes** — суффиксы файлов, по которым строится `files`-таргет. По умолчанию — `['bemhtml', 'bemhtml.xjst']`.
* *String* **exportName** — Имя переменной-обработчика BEMHTML. По умолчанию — `'BEMHTML'`.
* *String* **applyFuncName** — Название apply-функции вызова шаблонов. По умолчанию — `apply`.
* *Boolean* **devMode** — Development-режим. По умолчанию — true.
* *Boolean* **cache** — Кэширование. Возможно только в production-режиме. По умолчанию — `false`.
* *Object* **requires** — Хэш-объект, прокидывающий в генерируемую для скомпилированных шаблонов обвязку, необходимые модули.

**Пример**

```javascript
nodeConfig.addTech([ require('enb-xjst-i18n/techs/bemhtml-i18n'), { lang: {lang} } ]);
```

Лицензия
--------

© 2015 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
