Для работы программы должен быть локально запущен mongo на стандартном порту 27017


# Добавление тестовых экземлпяров сущностей
`node index.js`
![image](https://github.com/sosiso4ka-istu/mongoose-test/assets/167700280/379ca5dc-7d02-49a1-a5cb-7836e450c30a)
В бд появилась таблица online-school, в ней появились тестовые экземпляры сущностей.
2 курса, 6 уроков (3 на каждый курс), 6 дз (3 на каждый урок)
2 юзера - учитель (руководит двумя курсами), ученик (одновременно изучает два курса)



# В папке actions находятся файлы - методы апи.

# 2 - node actions/createUser.js
В первый промпт вводим имя, во второй - роль из enum (student, teacher, admin)
![image](https://github.com/sosiso4ka-istu/mongoose-test/assets/167700280/38bcf2f5-b93b-4330-80c9-86064de374cb)
В таблице online-school создался экземпляр сущности user.

# 3 - node actions/deleteUser.js
В консоль выводятся все ученики и их id. В промпт вводим id ученика, подтверждаем удаление, экземпляр удаляется из таблицы.
![image](https://github.com/sosiso4ka-istu/mongoose-test/assets/167700280/53553944-223b-4fc0-8e55-fc3b1b42b546)


# 4 - node actions/getCourses.js
В консоль выводятся все курсы и их преподаватели. Дополнительный запрос на получение имен преподавателей.
![image](https://github.com/sosiso4ka-istu/mongoose-test/assets/167700280/4c5b478f-c190-412e-8123-097397b1b5b4)
