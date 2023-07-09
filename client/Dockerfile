#install base image
FROM node:16-alpine

#tambah env variable (krn bug create-react-app)
ENV CI=true
ENV WDS_SOCKET_PORT=0

#set working directory, biar bs ketemu aplikasi yg dipake command, samo kito copy paste file kito ditaro di dir ini
WORKDIR /app

#copy file dari directory folder project ini (yg di lptp kito) ke container
#copy file yg jarang diganti, dan prioritas (krn perlu install sesudahny kyk package.json)
COPY ./package.json ./

#install dependencies di ./package.json
RUN npm install

#copy file dari directory folder project ini (yg di lptp kito) ke container
#copy file yg sering diganti (source code dan file file lainnya) 
COPY ./ ./

#default command, per kata dipisah dimasukin dalam list
CMD ["npm", "start"]
