INSERT INTO departments (id, name, code, adress, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Отдел метрологии', 'MTR-001', 'г. Москва, ул. Ленина, д. 1, каб. 101', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Производственный цех №1', 'PCH-001', 'г. Москва, ул. Ленина, д. 1, корп. 2', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Производственный цех №2', 'PCH-002', 'г. Москва, ул. Ленина, д. 1, корп. 3', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Лаборатория качества', 'LAB-001', 'г. Москва, ул. Ленина, д. 1, каб. 201', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Отдел технического контроля', 'OTK-001', 'г. Москва, ул. Ленина, д. 1, каб. 301', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Склад готовой продукции', 'SKL-001', 'г. Москва, ул. Ленина, д. 1, корп. 4', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Отдел главного энергетика', 'OGE-001', 'г. Москва, ул. Ленина, д. 1, каб. 401', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Ремонтно-механический цех', 'RMC-001', 'г. Москва, ул. Ленина, д. 1, корп. 5', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Испытательная лаборатория', 'ISP-001', 'г. Москва, ул. Ленина, д. 1, каб. 501', NOW(), NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Отдел главного технолога', 'OGT-001', 'г. Москва, ул. Ленина, д. 1, каб. 601', NOW(), NOW());

INSERT INTO people (id, last_name, first_name, middle_name, birth_date, phone, email, created_at, updated_at) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Иванов', 'Иван', 'Иванович', '1985-03-15', '+7-999-111-11-11', 'ivanov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Петров', 'Пётр', 'Петрович', '1990-07-22', '+7-999-222-22-22', 'petrov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Сидорова', 'Анна', 'Сергеевна', '1988-11-30', '+7-999-333-33-33', 'sidorova@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Козлов', 'Алексей', 'Михайлович', '1982-05-10', '+7-999-444-44-44', 'kozlov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Новикова', 'Елена', 'Владимировна', '1995-09-18', '+7-999-555-55-55', 'novikova@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Морозов', 'Дмитрий', 'Андреевич', '1979-12-25', '+7-999-666-66-66', 'morozov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Волкова', 'Ольга', 'Николаевна', '1992-04-08', '+7-999-777-77-77', 'volkova@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Соколов', 'Сергей', 'Александрович', '1987-08-14', '+7-999-888-88-88', 'sokolov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Лебедева', 'Мария', 'Дмитриевна', '1993-01-28', '+7-999-999-99-99', 'lebedeva@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Кузнецов', 'Андрей', 'Викторович', '1984-06-05', '+7-999-000-00-00', 'kuznetsov@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Попова', 'Наталья', 'Игоревна', '1991-02-12', '+7-999-123-45-67', 'popova@company.ru', NOW(), NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Васильев', 'Владимир', 'Олегович', '1986-10-20', '+7-999-234-56-78', 'vasiliev@company.ru', NOW(), NOW());


INSERT INTO employees (id, person_uuid, department_uuid, position, hire_date, status, created_at, updated_at) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Начальник отдела метрологии', '2015-01-15', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Инженер-метролог', '2018-03-20', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Инженер-метролог', '2019-06-10', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Начальник цеха', '2010-08-01', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Технолог', '2020-02-14', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Начальник цеха', '2008-04-22', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Заведующий лабораторией', '2016-09-05', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Лаборант', '2021-01-18', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Контролёр ОТК', '2022-05-30', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Главный энергетик', '2012-11-12', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Инженер-испытатель', '2019-07-25', 'active', NOW(), NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Техник-метролог', '2023-03-01', 'active', NOW(), NOW());

INSERT INTO equipment_types (id, name, verification_interval_months, description, measurable_units, created_at, updated_at) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Мультиметр цифровой', 12, 'Прибор для измерения напряжения, тока и сопротивления', '{"В", "А", "Ом"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Манометр', 12, 'Прибор для измерения давления', '{"Па", "кПа", "МПа", "бар"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Термометр цифровой', 24, 'Прибор для измерения температуры', '{"°C", "°F", "K"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Штангенциркуль', 12, 'Инструмент для измерения линейных размеров', '{"мм", "см"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Микрометр', 12, 'Прибор для точного измерения малых размеров', '{"мм", "мкм"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Весы лабораторные', 12, 'Прибор для измерения массы', '{"г", "кг", "мг"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'Осциллограф', 24, 'Прибор для исследования электрических сигналов', '{"В", "с", "Гц"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'Калибратор давления', 12, 'Эталонный прибор для калибровки манометров', '{"Па", "кПа", "МПа"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'Влагомер', 6, 'Прибор для измерения влажности', '{"%"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'Тахометр', 12, 'Прибор для измерения частоты вращения', '{"об/мин", "Гц"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Люксметр', 12, 'Прибор для измерения освещённости', '{"лк"}', NOW(), NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Шумомер', 24, 'Прибор для измерения уровня шума', '{"дБ"}', NOW(), NOW());

INSERT INTO equipment (id, serial_number, equipment_type_uuid, accuracy_class, purchase_date, cost, lifespan_years, created_at, updated_at) VALUES
-- Мультиметры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'MM-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 0.5, '2023-01-15', 15000.00, 10, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'MM-2023-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 0.5, '2023-02-20', 15000.00, 10, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'MM-2022-003', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 0.1, '2022-05-10', 45000.00, 10, NOW(), NOW()),
-- Манометры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'MN-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 0.4, '2023-03-05', 8000.00, 8, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'MN-2022-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 0.6, '2022-08-12', 5000.00, 8, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'MN-2021-003', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 0.4, '2021-04-18', 8000.00, 8, NOW(), NOW()),
-- Термометры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'TM-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 0.1, '2023-06-01', 12000.00, 10, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'TM-2022-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 0.5, '2022-09-15', 6000.00, 10, NOW(), NOW()),
-- Штангенциркули
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'SHC-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 0.02, '2023-04-10', 3500.00, 15, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'SHC-2021-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 0.05, '2021-11-20', 2000.00, 15, NOW(), NOW()),
-- Микрометры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'MK-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 0.01, '2023-07-08', 8000.00, 15, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'MK-2020-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 0.01, '2020-02-14', 7500.00, 15, NOW(), NOW()),
-- Весы
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'VS-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 0.001, '2023-08-22', 85000.00, 12, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'VS-2021-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 0.01, '2021-06-30', 35000.00, 12, NOW(), NOW()),
-- Осциллографы
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'OSC-2022-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 1.0, '2022-03-18', 120000.00, 10, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'OSC-2019-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 1.5, '2019-10-05', 95000.00, 10, NOW(), NOW()),
-- Калибраторы
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'KD-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 0.02, '2023-05-12', 250000.00, 15, NOW(), NOW()),
-- Влагомеры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'VL-2024-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 1.0, '2024-01-10', 18000.00, 8, NOW(), NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'VL-2023-002', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 1.5, '2023-09-28', 12000.00, 8, NOW(), NOW()),
-- Тахометры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'TH-2022-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 0.5, '2022-07-14', 22000.00, 10, NOW(), NOW()),
-- Люксметры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'LX-2023-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3.0, '2023-11-05', 9500.00, 10, NOW(), NOW()),
-- Шумомеры
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'SH-2021-001', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1.0, '2021-12-01', 45000.00, 10, NOW(), NOW());

INSERT INTO equipment_statuses (id, equipment_uuid, status, department_uuid, created_at, updated_at) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'on_verification', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'in_repair', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'decommissioned', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'on_verification', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', NOW(), NOW()),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'in_use', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', NOW(), NOW());

INSERT INTO verification_histories (id, equipment_uuid, verification_date, result, certificate_number, verified_by_employee_uuid, notes, created_at, updated_at) VALUES
-- Мультиметр MM-2023-001 (поверен при покупке)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', '2023-01-15', 'passed', 'CERT-2023-0001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка при покупке', NOW(), NOW()),

-- Мультиметр MM-2023-002
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', '2023-02-20', 'passed', 'CERT-2023-0002', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Первичная поверка', NOW(), NOW()),

-- Мультиметр MM-2022-003 (поверен дважды)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '2022-05-10', 'passed', 'CERT-2022-0001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', '2023-05-08', 'passed', 'CERT-2023-0010', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Периодическая поверка', NOW(), NOW()),

-- Манометр MN-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', '2023-03-05', 'passed', 'CERT-2023-0003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Первичная поверка', NOW(), NOW()),

-- Манометр MN-2022-002 (просрочен - поверка была год назад)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '2022-08-12', 'passed', 'CERT-2022-0005', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', '2023-08-10', 'passed', 'CERT-2023-0020', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Периодическая поверка', NOW(), NOW()),

-- Манометр MN-2021-003 (в ремонте, последняя поверка давно)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', '2021-04-18', 'passed', 'CERT-2021-0001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', '2022-04-15', 'passed', 'CERT-2022-0010', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Периодическая поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', '2023-04-12', 'failed', 'CERT-2023-0015', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Не прошёл поверку, отправлен в ремонт', NOW(), NOW()),

-- Термометр TM-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', '2023-06-01', 'passed', 'CERT-2023-0004', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),

-- Термометр TM-2022-002
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', '2022-09-15', 'passed', 'CERT-2022-0008', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Первичная поверка', NOW(), NOW()),

-- Штангенциркуль SHC-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', '2023-04-10', 'passed', 'CERT-2023-0005', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Первичная поверка', NOW(), NOW()),

-- Штангенциркуль SHC-2021-002 (несколько поверок)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '2021-11-20', 'passed', 'CERT-2021-0005', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '2022-11-18', 'passed', 'CERT-2022-0015', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Периодическая поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '2023-11-15', 'passed', 'CERT-2023-0030', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Периодическая поверка', NOW(), NOW()),

-- Микрометр MK-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2023-07-08', 'passed', 'CERT-2023-0006', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),

-- Весы VS-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2023-08-22', 'passed', 'CERT-2023-0007', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),

-- Весы VS-2021-002
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2021-06-30', 'passed', 'CERT-2021-0010', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2022-06-28', 'passed', 'CERT-2022-0018', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Периодическая поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2023-06-25', 'passed', 'CERT-2023-0025', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Периодическая поверка', NOW(), NOW()),

-- Осциллограф OSC-2022-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2022-03-18', 'passed', 'CERT-2022-0003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),

-- Калибратор KD-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2023-05-12', 'passed', 'CERT-2023-0008', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка эталонного прибора', NOW(), NOW()),

-- Влагомер VL-2024-001 (новый, недавно поверен)
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2024-01-10', 'passed', 'CERT-2024-0001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Первичная поверка', NOW(), NOW()),

-- Влагомер VL-2023-002
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '2023-09-28', 'passed', 'CERT-2023-0028', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Первичная поверка', NOW(), NOW()),

-- Тахометр TH-2022-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2022-07-14', 'passed', 'CERT-2022-0012', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2023-07-12', 'passed', 'CERT-2023-0022', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Периодическая поверка', NOW(), NOW()),

-- Люксметр LX-2023-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2023-11-05', 'passed', 'CERT-2023-0029', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Первичная поверка', NOW(), NOW()),

-- Шумомер SH-2021-001
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2021-12-01', 'passed', 'CERT-2021-0012', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Первичная поверка', NOW(), NOW()),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2023-11-28', 'passed', 'CERT-2023-0032', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Периодическая поверка', NOW(), NOW());