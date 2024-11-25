# ParSeLL

**ParSeLL** is an innovative solution designed to streamline the international selling experience for businesses operating across borders. It leverages cutting-edge technologies like **Natural Language Processing (NLP)**, **AWS**, and **Blockchain** to simplify global commerce.

## Features

- **NLP Integration**: Facilitates seamless communication by breaking language barriers.
- **Blockchain Technology**: Enhances transaction security and transparency.
- **Cloud-Powered**: Built on AWS for scalability and reliability.
- **User-Centric Design**: Prioritizes ease of use for businesses navigating international markets.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sambit-Mondal/ParSeLL.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd next-app
   ```
   
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file and fill in the following:
```bash
# AWS Configuration
NEXT_APP_AWS_ACCESS_KEY="your_aws_access_key"
NEXT_APP_AWS_SECRET_KEY="your_aws_secret_key"
NEXT_APP_AWS_REGION="ap-south-1"
NEXT_APP_AWS_S3_BUCKET="parsell-amazon-smbhav"

# Amazon Selling Partner API Configuration
NEXT_APP_LWA_APP_ID="your_lwa_app_id"
NEXT_APP_LWA_CLIENT_SECRET="your_lwa_client_secret"
NEXT_APP_REFRESH_TOKEN="your_refresh_token"
NEXT_APP_SP_API_ENDPOINT="https://sellingpartnerapi-eu.amazon.com"
NEXT_APP_MARKETPLACE_ID="A21TJRUUN4KGV"

# MongoDB Configuration
NEXT_APP_MONGODB_URI="mongodb://localhost:27017/"
NEXT_APP_MONGODB_URL="mongodb://localhost:27017/ParSeLL"
NEXT_APP_MONGODB_DB="ParSeLL"

# Security Configuration
NEXT_APP_JWT_SECRET="your_jwt_secret"

# Email Configuration
NEXT_APP_EMAIL_USER="your_email_user"
NEXT_APP_EMAIL_PASS="your_email_password"

# Other API Keys
NEXT_APP_GROQ_API_KEY="your_groq_api_key"
GOOGLE_API_KEY="your_google_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
```
  
5. Start the development server:
   ```bash
   npm run dev
   ```


## Usage



## Technologies

- **TypeScript**
- **JavaScript**
- **TailwindCSS**
- **Next.js** framework for a robust front-end (for SSR)
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **AWS Translate** for real-time translation

## License

This project is licensed under the [MIT License](https://github.com/Sambit-Mondal/ParSeLL/blob/main/LICENSE).

## Authors

- Sambit Mondal
- Adarsh Rout
- Vikramaditya Singh
- Ankit Kumar

For any queries, feel free to contact the maintainers or raise an issue in the repository.

## Links

- [GitHub Repository](https://github.com/Sambit-Mondal/ParSeLL)
- [Demo Link](https://drive.google.com/file/d/1xjyQuypsoHbH9zfd8MEWBOin1HKnSEZ1/view?usp=drive_link)
