# Сборка иконочных шрифтов для всех проектов

**Важно!**
В пуллреквест, связанный с иконками, обязательно нужно ставить по фронтендеру из смежных проектов
(особенно при удалении иконок).

Что нужно сделать чтобы все заработало:

1) Склонировать себе репозиторий
2) С помощью командной строки перейти в ```font-icon/```
3) Установить пакеты: ```npm install``` или ```yarn```
4) Возможно, надо будет установить **gulp** глобально https://gulpjs.com/ 
5) Запустить сборщик ```npm run icons``` или ```yarn icons```

Результат для демо появится в ```font-icon/public/```.

Результат в виде шрифтов и scss/less файлов с классами для иконок появится в ```font-icon/dist/```.
