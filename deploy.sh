#!/bin/bash

echo "=========================================="
echo "  TesLongXiao Homepage - Docker 部署"
echo "=========================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "[ERROR] Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

if ! docker network ls | grep -q core_mx-space; then
    echo "[ERROR] core_mx-space 网络不存在"
    echo "[INFO] 请检查你的 MX-Space 核心服务是否已启动"
    echo "[INFO] 如果服务已启动，请运行："
    echo "  docker network ls"
    echo "  查看实际的网络名称"
    exit 1
fi

# 显示网络信息
echo "[INFO] 检查现有网络配置..."
SUBNET=$(docker network inspect core_mx-space 2>/dev/null | grep -A 5 "IPAM" | grep Subnet | awk -F'"' '{print $4}')
echo "[INFO] 当前网络子网: $SUBNET"

# 检查 IP 是否被占用
echo "[INFO] 检查 IP 地址占用情况..."
USED_IPS=$(docker network inspect core_mx-space 2>/dev/null | grep -A 10 "Containers" | grep "IPv4Address" | awk -F'"' '{print $4}' | cut -d'/' -f1)
echo "[INFO] 已使用的 IP 地址:"
echo "$USED_IPS" | while read ip; do
    if [ ! -z "$ip" ]; then
        CONTAINER=$(docker network inspect core_mx-space 2>/dev/null | grep -B 5 "$ip" | grep "Name" | awk -F'"' '{print $4}')
        echo "  - $ip ($CONTAINER)"
    fi
done

if echo "$USED_IPS" | grep -q "172.20.0.60"; then
    echo "[ERROR] IP 地址 172.20.0.60 已被占用"
    echo "[INFO] 请修改 docker-compose.yml 中的 ipv4_address"
    exit 1
fi

if [[ ! "$SUBNET" =~ ^172\.20\. ]]; then
    echo "[WARNING] 网络子网不是 172.20.x.x"
    echo "[WARNING] 请修改 docker-compose.yml 中的 ipv4_address"
    echo "[WARNING] 当前子网: $SUBNET"
    read -p "是否继续部署? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 停止旧容器
echo "[INFO] 停止旧容器..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null

# 构建并启动服务
echo "[INFO] 构建并启动服务..."
docker-compose up -d --build || docker compose up -d --build

# 等待服务启动
echo "[INFO] 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "=========================================="
echo "  服务状态"
echo "=========================================="
docker-compose ps || docker compose ps

# 获取容器 IP
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' teslongxiao-homepage 2>/dev/null)

# 测试健康检查
echo ""
echo "[INFO] 测试健康检查..."
sleep 3

if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo "[SUCCESS] 健康检查通过"
    curl -s http://localhost:8081/health | jq . 2>/dev/null || curl -s http://localhost:8081/health
else
    echo "[WARNING] 健康检查失败，请查看日志"
fi

# 自动清理构建残余，保持系统清爽
echo ""
echo "[INFO] 正在清理构建残余..."
docker image prune -f
docker builder prune -f --filter "until=24h" 

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
echo ""
echo "容器 IP: $CONTAINER_IP"
echo "网络名称: core_mx-space"
echo ""
echo "访问方式："
echo "  1. 内网测试: http://localhost:8081"
echo "  2. VPS 公网: http://<你的VPS公网IP>:8081"
echo "  3. 域名访问: 需要在 Nginx Proxy Manager 配置"
echo ""
echo "Nginx Proxy Manager 配置："
echo "  Scheme: http"
echo "  Forward Host: $CONTAINER_IP (或 teslongxiao-homepage)"
echo "  Forward Port: 8081"
echo ""
echo "常用命令："
echo "  查看日志: docker-compose logs -f homepage"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo ""
