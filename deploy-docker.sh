#!/bin/bash

echo "=========================================="
echo "  Logos Homepage - Docker 部署"
echo "=========================================="
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "[ERROR] Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "[INFO] 拉取最新镜像..."
docker compose pull

echo "[INFO] 停止旧容器..."
docker compose down

echo "[INFO] 启动新容器..."
docker compose up -d

echo "[INFO] 等待服务启动..."
sleep 5

echo ""
echo "=========================================="
echo "  服务状态"
echo "=========================================="
docker compose ps

echo ""
echo "[INFO] 测试健康检查..."
sleep 3

if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo "[SUCCESS] 健康检查通过"
    curl -s http://localhost:8081/health | jq . 2>/dev/null || curl -s http://localhost:8081/health
else
    echo "[WARNING] 健康检查失败，请查看日志"
fi

echo ""
echo "[INFO] 清理旧镜像..."
docker image prune -f

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
echo ""
echo "访问方式："
echo "  1. 内网测试: http://localhost:8081"
echo "  2. 域名访问: https://www.teslongxiao.cn"
echo ""
echo "常用命令："
echo "  查看日志: docker compose logs -f homepage"
echo "  停止服务: docker compose down"
echo "  重启服务: docker compose restart"
echo ""

