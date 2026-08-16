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

        // Очищаем старые тестовые данные этого пользователя
        await pool.query('DELETE FROM tasks WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM contacts WHERE user_id = $1', [userId]);
        console.log('🧹 Очищены старые задачи и контакты пользователя.');

        // 2. Добавление 26 контактов для полноценного тестирования пагинации и поиска
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
            {
                name: 'Артем Попов',
                email: 'artem.popov@yandex-cloud.net',
                phone: '+7 (999) 777-88-99',
                company: 'Yandex Cloud',
                job_position: 'Senior Solution Architect',
            },
            {
                name: 'Екатерина Соколова',
                email: 'e.sokolova@ozon-b2b.ru',
                phone: '+7 (999) 888-99-00',
                company: 'OZON Marketplace',
                job_position: 'E-commerce Lead',
            },
            {
                name: 'Роман Ковалев',
                email: 'r.kovalev@kaspersky-security.com',
                phone: '+7 (911) 123-45-67',
                company: 'Kaspersky Lab',
                job_position: 'Security Specialist',
            },
            {
                name: 'Ольга Михайлова',
                email: 'o.mikhaylova@sber-tech.ru',
                phone: '+7 (912) 234-56-78',
                company: 'Sber Tech',
                job_position: 'Product Manager',
            },
            {
                name: 'Максим Федоров',
                email: 'm.fedorov@vk-teams.com',
                phone: '+7 (913) 345-67-89',
                company: 'VK Teams',
                job_position: 'Engineering Manager',
            },
            {
                name: 'Виктория Павлова',
                email: 'v.pavlova@tinkoff-b2b.ru',
                phone: '+7 (914) 456-78-90',
                company: 'Tinkoff Business',
                job_position: 'Account Executive',
            },
            {
                name: 'Иван Семенов',
                email: 'i.semenov@wb-logistics.ru',
                phone: '+7 (915) 567-89-01',
                company: 'Wildberries Logistics',
                job_position: 'Operations Lead',
            },
            {
                name: 'Татьяна Голубева',
                email: 't.golubeva@avito-services.ru',
                phone: '+7 (916) 678-90-12',
                company: 'Avito Services',
                job_position: 'Sales Director',
            },
            {
                name: 'Кирилл Виноградов',
                email: 'k.vinogradov@selectel-cloud.ru',
                phone: '+7 (917) 789-01-23',
                company: 'Selectel Hosting',
                job_position: 'Infrastructure Lead',
            },
            {
                name: 'Мария Богданова',
                email: 'm.bogdanova@hh-tech.ru',
                phone: '+7 (918) 890-12-34',
                company: 'HeadHunter HR-tech',
                job_position: 'HR Business Partner',
            },
            {
                name: 'Денис Воробьев',
                email: 'd.vorobiev@skyeng-b2b.com',
                phone: '+7 (919) 901-23-45',
                company: 'Skyeng B2B',
                job_position: 'Partnerships Lead',
            },
            {
                name: 'Полина Орлова',
                email: 'p.orlova@dodo-brands.io',
                phone: '+7 (920) 012-34-56',
                company: 'Dodo Brands',
                job_position: 'Quality Assurance Lead',
            },
            {
                name: 'Сергей Андреев',
                email: 's.andreev@x5-digital.ru',
                phone: '+7 (921) 123-45-67',
                company: 'X5 Digital',
                job_position: 'Data Engineering Lead',
            },
            {
                name: 'Наталья Макарова',
                email: 'n.makarova@alfabank-corp.ru',
                phone: '+7 (922) 234-56-78',
                company: 'Альфа-Банк',
                job_position: 'Corporate Banking Lead',
            },
            {
                name: 'Владислав Зайцев',
                email: 'v.zaytsev@ptsecurity.com',
                phone: '+7 (923) 345-67-89',
                company: 'Positive Technologies',
                job_position: 'Cyber Security Analyst',
            },
            {
                name: 'Кристина Соловьева',
                email: 'k.solovieva@lamoda-supply.ru',
                phone: '+7 (924) 456-78-90',
                company: 'Lamoda Group',
                job_position: 'Supply Chain Specialist',
            },
            {
                name: 'Игорь Козлов',
                email: 'i.kozlov@mindbox-crm.io',
                phone: '+7 (925) 567-89-01',
                company: 'Mindbox CRM',
                job_position: 'Integration Engineer',
            },
            {
                name: 'Дарья Белова',
                email: 'd.belova@skillbox-edtech.ru',
                phone: '+7 (926) 678-90-12',
                company: 'Skillbox EdTech',
                job_position: 'EdTech Consultant',
            },
            {
                name: 'Антон Григорьев',
                email: 'a.grigoriev@rutube-media.ru',
                phone: '+7 (927) 789-01-23',
                company: 'Rutube Media',
                job_position: 'Streaming Engineer',
            },
            {
                name: 'Юлия Тарасова',
                email: 'yu.tarasova@nexign-telecom.com',
                phone: '+7 (928) 890-12-34',
                company: 'Nexign Telecom',
                job_position: 'Solution Architect',
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
            {
                contactIndex: 6, // Артем Попов (Yandex Cloud)
                content: 'Обсудили архитектуру гибридного облака и требования к безопасности данных.',
            },
            {
                contactIndex: 7, // Екатерина Соколова (OZON)
                content: 'Запрос на пакетную выгрузку каталога и автоматизацию обработки заказов.',
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
            {
                title: 'Отправить коммерческое предложение в Yandex Cloud',
                description: 'Согласовать спецификацию API и технический регламент.',
                status: 'pending',
                position: 3,
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
            {
                title: 'Интеграция с OZON Marketplace API',
                description: 'Тестирование синхронизации статусов заказов и остатков.',
                status: 'in_progress',
                position: 2,
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
