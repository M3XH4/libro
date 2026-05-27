FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git unzip zip curl \
    libpq-dev libzip-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libicu-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip gd intl mbstring bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer diagnose || true
RUN composer update --no-dev --optimize-autoloader --no-interaction --prefer-dist --ignore-platform-req=ext-redis

RUN php artisan config:clear || true

RUN chown -R www-data:www-data storage bootstrap/cache

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

CMD php artisan config:clear && \
    php artisan migrate:fresh --seed --force && \
    php artisan storage:link || true && \
    apache2-foreground