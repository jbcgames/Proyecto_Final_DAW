CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    fecha_nacimiento DATE,
    nombre_usuario VARCHAR(50) UNIQUE,
    password VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS autos (
    id SERIAL PRIMARY KEY,
    disponible BOOLEAN,
    nombre VARCHAR(50),
    tipo VARCHAR(50),
    color VARCHAR(50),
    modelo VARCHAR(50),
    marca VARCHAR(50),
    transmision VARCHAR(50),
    motor VARCHAR(50),
    precio INT,
    imagen_link VARCHAR(1500)
);

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) REFERENCES usuarios(nombre_usuario),
    auto_id INT REFERENCES autos(id),
    seguros BOOLEAN,
    asistencia_carretera BOOLEAN,
    silla_bebes BOOLEAN,
    equipo_lujo BOOLEAN,
    precio_final INT
);



INSERT INTO autos (nombre, tipo, color, modelo, marca, transmision, motor, precio, imagen_link, disponible) VALUES
('Mustang GT', 'Coupe', 'Rojo', '2020', 'Ford', 'Manual', 'V8', 55000,'https://build.ford.com/dig/Ford/Mustang/2024/HD-TILE/Image%5B%7CFord%7CMustang%7C2024%7C1%7C1.%7C300A.P8C..PHY..88D.89W.~2WD00_BCMAB.AC--C.13R.COU.BSHEH.BYBBR.CJPAA.LTS.51W.64T.TA6.RWD.45D.99F.FS--A.HLLAD.58V.IDBAD.SY4.44X.GT.YZTAB.CLO.%5D/EXT/1/vehicle.png', TRUE),
('Civic Type R', 'Hatchback', 'Azul', '2019', 'Honda', 'Manual', 'I4 Turbo', 36000,'https://www.cars.com/i/large/in/v2/stock_photos/7bb5cb1c-0348-4e7a-a1e8-cd9cca7666f4/004b0087-e6bc-4df3-a0c6-86c28075d724.png', TRUE),
('Model S', 'Sedan', 'Negro', '2021', 'Tesla', 'Automática', 'Eléctrico', 79999,'https://service.tesla.com/docs/Public/diy/images/GUID-5543BA62-932F-46C5-B1EF-44707D4726B2-online-en-US.png', TRUE),
('Camry SE', 'Sedan', 'Blanco', '2018', 'Toyota', 'Automática', 'I4', 24000,'https://media.chromedata.com/MediaGallery/media/MjkzOTU4Xk1lZGlhIEdhbGxlcnk/eyE0KUorcwtav5hKEWdJ8Q6XFpkE-tbvBKPg_8sTYzW9NDZI90wV0MHzo0YXgJEOOUxaTIjJQYMk5Moq95j3PZMcaxBUwYLba6-5SN2FSLgztsJ31UqPKWZC0xCXSHwAz8h-G0GH_iikcWqPeWPl1DDSjcj4PIhFKDz709ED4PpJwA6oKpr3MA/cc_2023TOC020027_01_640_218.png', TRUE),
('Wrangler', 'SUV', 'Verde', '2022', 'Jeep', 'Manual', 'V6', 42000,'https://www.cars.com/i/large/in/v2/stock_photos/b8b8abd2-feae-422e-8fce-b8d1603f9123/0628062e-3546-45cd-9abf-b2950da23fa0.png', TRUE),
('F-150', 'Pick-up', 'Plata', '2020', 'Ford', 'Automática', 'V8', 50000,'https://crdms.images.consumerreports.org/c_lfill,w_470,q_auto,f_auto/prod/cars/cr/car-versions/19763-2021-ford-f-150-xlt', TRUE),
('3 Series', 'Sedan', 'Azul', '2019', 'BMW', 'Automática', 'I4 Turbo', 45000,'https://mystrongad.com/MWB_MotorwerksBMW/Digital/3%20Series/2024/2024-BMW-3-Series-Gray.webp', TRUE),
('A4', 'Sedan', 'Gris', '2021', 'Audi', 'Automática', 'I4 Turbo', 47000,'https://crdms.images.consumerreports.org/c_lfill,w_470,q_auto,f_auto/prod/cars/cr/model-years/15099-2023-audi-a4', TRUE),
('CX-5', 'SUV', 'Rojo', '2022', 'Mazda', 'Automática', 'I4', 32000,'https://www.mazdausa.com/siteassets/vehicles/2024/cx-5/new-build--price/trims/34-jellies/2.5-s-premium-plus/2024-mazda-cx-5-2.5-s-premium-plus-package', TRUE),
('Accord', 'Sedan', 'Blanco', '2020', 'Honda', 'Automática', 'I4 Turbo', 28000,'https://vehicle-images.dealerinspire.com/179c-110007272/thumbnails/large/1HGCY2F65RA057929/cdf575ece6d269009028b405d8d967a6.png', TRUE),
('Challenger', 'Coupe', 'Naranja', '2019', 'Dodge', 'Manual', 'V8', 45000,'https://alcf.s3.us-west-1.amazonaws.com/_custom/2023/dodge/challenger/2023%20dodge%20challenger%20%282%29.png', TRUE),
('Outback', 'SUV', 'Verde', '2021', 'Subaru', 'Automática', 'Bóxer', 37000,'https://s7d1.scene7.com/is/image/scom/RDI_UAT_360e_032?$750p$', TRUE),
('Corolla', 'Sedan', 'Gris', '2018', 'Toyota', 'Automática', 'I4', 20000,'https://www.buyatoyota.com/assets/img/vehicle-info/Corolla/2023/hero_image_corolla.png', TRUE),
('Impreza WRX', 'Sedan', 'Azul', '2020', 'Subaru', 'Manual', 'Bóxer Turbo', 35000,'https://www.cars.com/i/large/in/v2/stock_photos/538d13f1-4496-4009-8d4d-907dc460a197/c44c1ec1-fff2-4a0c-9dbb-e41d5c1f3ea3.png', TRUE),
('Escalade', 'SUV', 'Negro', '2021', 'Cadillac', 'Automática', 'V8', 90000,'https://platform.cstatic-images.com/in/v2/stock_photos/e09e8fa4-e974-4a06-9a28-7afadcd86456/9fbe1011-8284-43dc-a992-03f83e7555a9.png', TRUE),
('Mustang Mach-E', 'SUV', 'Blanco', '2021', 'Ford', 'Automática', 'Eléctrico', 60000,'https://www.briarwoodford.com/static/dealer-17694/23Ford-MustangMachE-GT-ShadowBlack-Jellybean.png', TRUE),
('Golf GTI', 'Hatchback', 'Rojo', '2019', 'Volkswagen', 'Manual', 'I4 Turbo', 30000,'https://www.cars.com/i/large/in/v2/stock_photos/de3c85b0-c7b9-4c45-aefb-31faacea3a0a/81a3f534-4bb0-4659-82d7-f2a16d0e75c0.png', TRUE),
('Charger', 'Sedan', 'Negro', '2020', 'Dodge', 'Automática', 'V6', 40000,'https://alcf.s3.us-west-1.amazonaws.com/_custom/2023/dodge/charger/2023-dodge-charger%20%281%29.png', TRUE),
('X5', 'SUV', 'Azul', '2019', 'BMW', 'Automática', 'I6 Turbo', 65000,'https://cache.bmwusa.com/cosy.arox?pov=walkaround&brand=WBBM&vehicle=25XO&client=byo&paint=P0300&fabric=FKPSW&sa=S01CE,S01SF,S0255,S02TB,S0302,S0319,S0322,S03AT,S03MB,S0402,S0420,S0423,S0459,S0481,S0494,S04FL,S04KR,S04T8,S04UR,S0552,S05AC,S05AS,S05DM,S0676,S06AC,S06AK,S06C4,S06CP,S06NX,S06U2,S0775&quality=70&bkgnd=transparent&resp=png&angle=40&w=9800&h=8000&x=100&y=1100', TRUE),
('Silverado', 'Pick-up', 'Blanco', '2020', 'Chevrolet', 'Automática', 'V8', 53000,'https://img.sm360.ca/ir/w770/images/newcar/ca/2024/chevrolet/silverado-1500/high-country-crew-cab-standard-bed/pickup/exteriorColors/2024_chevrolet_silverado_1500_high-country_crew-standard_032_g1w.png', TRUE),
('A6', 'Sedan', 'Gris', '2021', 'Audi', 'Automática', 'V6 Turbo', 55000,'https://crdms.images.consumerreports.org/c_lfill,w_470,q_auto,f_auto/prod/cars/cr/model-years/15101-2023-audi-a6', TRUE),
('Tucson', 'SUV', 'Blanco', '2022', 'Hyundai', 'Automática', 'I4', 29000,'https://vehicle-images.dealerinspire.com/stock-images/thumbnails/large/chrome/92d6138c3abd4d25610ab2b3274f3191.png', TRUE),
('Ram 1500', 'Pick-up', 'Rojo', '2020', 'Ram', 'Automática', 'V8', 58000,'https://medias.fcacanada.ca/jellies/renditions/2024/800x510/CC24_DT6P98_2TH_PAU_APA_XXX_XXX_XXX.8f4eb7a250e45b87bab8b7e47262f47d.png', TRUE),
('Rav4', 'SUV', 'Negro', '2021', 'Toyota', 'Automática', 'I4', 35000,'https://www.cars.com/i/large/in/v2/stock_photos/eb392377-4453-4bf8-a314-b421d495a70d/00800ef6-b061-43de-ba63-87d847ab27c1.png', TRUE),
('Tahoe', 'SUV', 'Azul', '2019', 'Chevrolet', 'Automática', 'V8', 65000,'https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/vehicles/2024/suvs/tahoe/trims/2023-tahoe-cc10706-1lz-g1w-trimselector.png?imwidth=960', TRUE);