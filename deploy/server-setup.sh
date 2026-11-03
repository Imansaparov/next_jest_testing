#!/usr/bin/env bash
# One-time setup of a fresh Ubuntu 22.04/24.04 VM (e.g. Oracle Cloud Always Free).
# Installs Docker + Nginx, clones the repo, starts the app, configures HTTPS.
#
# Usage (on the server):
#   curl -fsSL https://raw.githubusercontent.com/Imansaparov/next_jest_testing/master/deploy/server-setup.sh | sudo bash
#   # or with your own domain:
#   curl -fsSL .../server-setup.sh | sudo DOMAIN=example.com bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/Imansaparov/next_jest_testing.git}"
APP_USER="${SUDO_USER:-ubuntu}"
APP_DIR="/home/${APP_USER}/app"

if [[ $EUID -ne 0 ]]; then
  echo "Run with sudo" >&2
  exit 1
fi

PUBLIC_IP="$(curl -fsS https://api.ipify.org)"
# Free domain for any IP: 1.2.3.4 -> 1-2-3-4.sslip.io (works with Let's Encrypt).
DOMAIN="${DOMAIN:-${PUBLIC_IP//./-}.sslip.io}"
echo "==> Public IP: ${PUBLIC_IP}, domain: ${DOMAIN}"

echo "==> Swap (small free VMs run out of RAM during next build)"
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> Packages"
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  ca-certificates curl git nginx certbot python3-certbot-nginx iptables-persistent

echo "==> Docker"
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
usermod -aG docker "${APP_USER}"
systemctl enable --now docker

echo "==> Firewall: open 80/443 (Oracle Ubuntu images allow only SSH by default)"
for port in 80 443; do
  iptables -C INPUT -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT 2>/dev/null ||
    iptables -I INPUT -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT
done
netfilter-persistent save

echo "==> App"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  sudo -u "${APP_USER}" git clone --depth 1 "${REPO_URL}" "${APP_DIR}"
fi
echo "SITE_URL=https://${DOMAIN}" > "${APP_DIR}/.env"
chown "${APP_USER}:${APP_USER}" "${APP_DIR}/.env"
(cd "${APP_DIR}" && docker compose up -d --build)

echo "==> Nginx"
sed "s/__DOMAIN__/${DOMAIN}/" "${APP_DIR}/deploy/nginx/artisan-kiln.conf" \
  > /etc/nginx/sites-available/artisan-kiln.conf
ln -sf /etc/nginx/sites-available/artisan-kiln.conf /etc/nginx/sites-enabled/artisan-kiln.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> HTTPS (Let's Encrypt)"
if certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos \
  --register-unsafely-without-email --redirect; then
  echo "Done: https://${DOMAIN}"
else
  echo "WARNING: certbot failed (are ports 80/443 open in the Oracle Security List?)."
  echo "The site still works over HTTP: http://${DOMAIN}"
fi
