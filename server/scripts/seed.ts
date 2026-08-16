import pool from '../db';

async function seed() {
    console.log('🌱 Запуск сидинга тестовых данных...');

    try {
        // 1. Поиск пользователя
        const userRes = await pool.query('SELECT id, name, email FROM users WHERE email = $1', ['kplatonglfc@gmail.com']);
        if (userRes.rows.length === 0) {
            console.error('❌ Пользователь kplatonglfc@gmail.com не найден в базе.');
            process.exit(1);
        }

        const userId = userRes.rows[0].id;
        console.log(`👤 Найден пользователь: ${userRes.rows[0].name} (${userRes.rows[0].email}), ID: ${userId}`);

        // Очищаем старые тестовые данные этого пользователя (заметки удалятся каскадно через контакты)
        await pool.query('DELETE FROM tasks WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM contacts WHERE user_id = $1', [userId]);
        console.log('🧹 Очищены старые задачи и контакты пользователя.');

        // 2. Добавление контактов
        const mockContacts = [
            {
                name: 'Александр Смирнов',
                email: 'a.smirnov@techcorp.io',
                phone: '+7 (999) 111-22-33',
                company: 'TechCorp Solutions',
                job_position: 'CTO',
            },
            {
                name: 'Елена Васильева',
                email: 'elena.v@fintech-pay.com',
                phone: '+7 (999) 222-33-44',
                company: 'FinTech Pay',
                job_position: 'Head of Product',
            },
            {
                name: 'Дмитрий Кузнецов',
                email: 'd.kuznetsov@cloudscale.ru',
                phone: '+7 (999) 333-44-55',
                company: 'CloudScale Systems',
                job_position: 'Lead DevOps Engineer',
            },
            {
                name: 'Анна Морозова',
                email: 'morozova@growthhub.agency',
                phone: '+7 (999) 444-55-66',
                company: 'GrowthHub Agency',
                job_position: 'Marketing Director',
            },
            {
                name: 'Михаил Новиков',
                email: 'm.novikov@retailpro.ru',
                phone: '+7 (999) 555-66-77',
                company: 'RetailPro Global',
                job_position: 'Chief Commercial Officer',
            },
            {
                name: 'София Лебедева',
                email: 'sofia.design@creative-studio.dev',
                phone: '+7 (999) 666-77-88',
                company: 'Creative Studio Dev',
                job_position: 'Art Director',
            },
        ];

        const insertedContacts = [];
        for (const c of mockContacts) {
            const res = await pool.query(
                `INSERT INTO contacts (user_id, name, email, phone, company, job_position)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, name, email, company, job_position, phone`,
                [userId, c.name, c.email, c.phone, c.company, c.job_position]
            );
            insertedContacts.push(res.rows[0]);
        }
        console.log(`✅ Добавлено контактов: ${insertedContacts.length}`);

        // 3. Добавление заметок к контактам
        const mockNotes = [
            {
                contactIndex: 0, // Александр Смирнов (TechCorp)
                content: 'Обсудили продление контракта на Q4. Запросили скидку 5% при годовой оплате. Готовим КП.',
            },
            {
                contactIndex: 0,
                content: 'Созвон в Zoom назначен на вторник 11:00 для обсуждения кастомных интеграций через REST API.',
            },
            {
                contactIndex: 1, // Елена Васильева (FinTech Pay)
                content: 'Заинтересованы в модуле аналитики и кастомных дашбордах. Отправил демо-доступ.',
            },
            {
                contactIndex: 2, // Дмитрий Кузнецов (CloudScale)
                content: 'Уточнили технические требования по SLA (99.9%) и резервному копированию в PostgreSQL.',
            },
            {
                contactIndex: 3, // Анна Морозова (GrowthHub)
                content: 'Планируют запуск рекламной кампании в сентябре, нужен экспорт отчетов в CSV/Excel.',
            },
            {
                contactIndex: 4, // Михаил Новиков (RetailPro)
                content: 'Первичный контакт на конференции TechConf. Запланировали презентацию продукта на следующей неделе.',
            },
        ];

        let notesCount = 0;
        for (const n of mockNotes) {
            const contact = insertedContacts[n.contactIndex];
            if (contact) {
                await pool.query(
                    'INSERT INTO notes (contact_id, content) VALUES ($1, $2)',
                    [contact.id, n.content]
                );
                notesCount++;
            }
        }
        console.log(`✅ Добавлено заметок к контактам: ${notesCount}`);

        // 4. Добавление задач
        const mockTasks = [
            // Pending
            {
                title: 'Подготовить коммерческое предложение для TechCorp',
                description: 'Включить скидку 5% при годовой оплате и блок по кастомным интеграциям.',
                status: 'pending',
                position: 0,
            },
            {
                title: 'Созвон с техлидом CloudScale Systems',
                description: 'Обсудить требования к безопасности данных, шифрованию и регламентам SLA.',
                status: 'pending',
                position: 1,
            },
            {
                title: 'Согласовать договор с юристом по GrowthHub',
                description: 'Проверить пункт о неразглашении (NDA) и условия оплаты.',
                status: 'pending',
                position: 2,
            },

            // In Progress
            {
                title: 'Провести демо платформы для команды FinTech Pay',
                description: 'Показать модуль аналитики, настройку воронки продаж и интеграцию задач.',
                status: 'in_progress',
                position: 0,
            },
            {
                title: 'Разработка интеграции вебхуков',
                description: 'Реализовать эндпоинты для отправки событий создания сделок и контактов.',
                status: 'in_progress',
                position: 1,
            },

            // Done
            {
                title: 'Первичный аудит базы контактов',
                description: 'Проверена корректность email-адресов и телефонов ключевых клиентов.',
                status: 'done',
                position: 0,
            },
            {
                title: 'Настройка Swagger API документации',
                description: 'Описаны эндпоинты аутентификации, контактов, задач и заметок.',
                status: 'done',
                position: 1,
            },
            {
                title: 'Инициализация схемы базы данных',
                description: 'Созданы таблицы users, contacts, tasks, notes, refresh_tokens с индексами.',
                status: 'done',
                position: 2,
            },
        ];

        let tasksCount = 0;
        for (const t of mockTasks) {
            await pool.query(
                `INSERT INTO tasks (title, description, user_id, status, position)
                 VALUES ($1, $2, $3, $4, $5)`,
                [t.title, t.description, userId, t.status, t.position]
            );
            tasksCount++;
        }
        console.log(`✅ Добавлено задач: ${tasksCount}`);

        console.log('🎉 Сидинг успешно завершен!');
    } catch (error) {
        console.error('❌ Ошибка во время сидинга:', error);
    } finally {
        await pool.end();
    }
}

seed();
