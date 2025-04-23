import requests
import random
import time
from faker import Faker
from colorama import Fore, Style, init

init()
fake = Faker()

# Configuración
BASE_URL = "http://localhost:8080/api"
ENDPOINT = "/clients"
TOTAL_FAKE_CLIENTS = 100

# Headers para la solicitud
headers = {
    "Content-Type": "application/json",
    "User-Agent": "DataSeeder/1.0"
}

def generate_fake_client():
    return {
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "email": fake.email(),
        "phone": fake.phone_number()
    }

def seed_clients(n):
    print(f"{Fore.YELLOW}[*] Inyectando {n} clientes falsos a {BASE_URL + ENDPOINT}{Style.RESET_ALL}\n")

    for i in range(n):
        data = generate_fake_client()
        try:
            response = requests.post(BASE_URL + ENDPOINT, json=data, headers=headers)
            if response.status_code == 201 or response.status_code == 200:
                print(f"{Fore.GREEN}[{i+1}/{n}] Cliente creado: {data['firstName']} {data['lastName']}{Style.RESET_ALL}")
            else:
                print(f"{Fore.RED}[{i+1}/{n}] Error: {response.status_code} - {response.text}{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}[{i+1}/{n}] Excepción al crear cliente: {str(e)}{Style.RESET_ALL}")

        # Pequeña pausa opcional para evitar sobrecargar el servidor
        time.sleep(0.1)

    print(f"\n{Fore.YELLOW}[✓] Proceso completado: {n} clientes inyectados.{Style.RESET_ALL}")

if __name__ == "__main__":
    seed_clients(TOTAL_FAKE_CLIENTS)
