# Pasos para loevantar la IA
`pkill -f "ollama run phi"`
`sudo killall ollama`
`sudo systemctl stop ollama`
`OLLAMA_HOST=0.0.0.0 ollama serve`
`docker compose up --build -d`