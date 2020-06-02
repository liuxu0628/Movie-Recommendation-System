FROM python:3.7.5

MAINTAINER Will Li


# Install dependencies
WORKDIR /back-end
COPY requirements.txt /back-end/
# RUN apk add --update py-pip
RUN python -m pip install -r requirements.txt
COPY . /back-end/

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]]