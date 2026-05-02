# Frame Launch
# Lightweight nginx container serving the static production web app.

FROM nginx:alpine

LABEL maintainer="Frame Launch"
LABEL description="Browser-based tool for creating App Store, Google Play, and marketing screenshots"

RUN rm -rf /usr/share/nginx/html/*

COPY *.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/
COPY *.css /usr/share/nginx/html/
COPY ads.txt robots.txt sitemap.xml /usr/share/nginx/html/
COPY models/ /usr/share/nginx/html/models/
COPY img/ /usr/share/nginx/html/img/
COPY guides/ /usr/share/nginx/html/guides/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
