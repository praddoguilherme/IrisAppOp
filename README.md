# IrisApp

## Descrição
IrisApp é um aplicativo mobile para gerenciamento de consultas de optométricas e oftalmológicas. Desenvolvido com React Native e Expo, o aplicativo permite aos usuários agendar consultas, visualizar histórico de atendimentos e gerenciar seu perfil médico.

## Índice
- Instalação
- Uso
- Funcionalidades
- Estrutura do Projeto
- Tecnologias Utilizadas
- Desenvolvimento
- Contribuição

## Instalação

Siga as instruções abaixo para configurar o ambiente de desenvolvimento:

```bash
# Clonar o repositório
git clone https://github.com/praddoguilherme/IrisApp.git
cd IrisApp

# Instalar dependências
npm install

# Instalar o Expo CLI globalmente (se necessário)
npm install -g expo-cli
```

## Uso

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
npx expo start
```

Após iniciar, você pode:
- Pressionar `a` para abrir no Android
- Pressionar `i` para abrir no iOS
- Pressionar `w` para abrir na web
- Escanear o QR code com o aplicativo Expo Go no seu dispositivo móvel

### Credenciais de Teste

Para fins de desenvolvimento, use as seguintes credenciais:
- Email: `teste@iris.com`
- Senha: `123456`

## Funcionalidades

- **Autenticação**: Login, registro e recuperação de senha
- **Agendamento de Consultas**: Marcar consultas com diferentes especialistas
- **Histórico Médico**: Visualização de consultas passadas
- **Perfil do Usuário**: Gerenciamento de dados pessoais e preferências

## Estrutura do Projeto

```
IrisApp/
├── assets/                 # Imagens e ícones
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── context/            # Contextos React (AuthContext)
│   ├── navigation/         # Configuração de navegação
│   ├── screens/            # Telas da aplicação
│   │   ├── appointments/   # Telas de consultas
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── forms/          # Formulários de login e registro
│   │   └── profile/        # Perfil do usuário
│   └── styles/             # Estilos e temas
└── supabase/               # Configuração do Supabase
```

## Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase](https://supabase.io/) (simulado para desenvolvimento)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker)

## Desenvolvimento

### Simulação de Backend

O aplicativo utiliza uma simulação do Supabase para desenvolvimento. Os dados são armazenados localmente usando AsyncStorage.

### Componentes principais

- **AppNavigator**: Gerencia a navegação principal entre autenticação e conteúdo
- **AuthContext**: Provê o estado de autenticação para toda a aplicação
- **MainTab**: Configura a navegação por abas na interface principal

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

Desenvolvido por Guilherme Prado © 2023-2025
