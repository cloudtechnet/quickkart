# <img width="1024" height="279" alt="logo" src="https://github.com/user-attachments/assets/bddb6c6b-f691-4864-b7dd-22e3ac78cba6" />

## 🚀 QuickKart.com – Real-Time DevOps Project Introduction 

Let’s understand this like we are in a classroom building a **real company product** 👇

---

# 🛒 1. Business Overview

**QuickKart.com** is a modern **E-Commerce platform** (similar to Amazon/Flipkart) where users can:

* Browse products
* Add items to cart
* Place orders
* Track deliveries

### 👥 Target Users

* **Customers** → Buy products
* **Admins** → Manage platform, users, reports
* **Vendors/Sellers** → Upload and manage products

### 🎯 Business Goals (Real Industry Focus)

* **Scalability** → Handle lakhs of users during sales (Big Billion Days type traffic)
* **High Availability** → Application should be up 24/7
* **Fast Performance** → Pages load quickly
* **Secure Transactions** → Protect user data & payments

👉 *In real companies, downtime = revenue loss. So DevOps plays a critical role.*

---

# 🏗️ 2. Architecture Overview (3-Tier Architecture)

We follow a **standard industry 3-tier architecture**:

### 🎨 Frontend (Presentation Layer)

* Built using **React**
* Runs in browser
* Handles UI like:

  * Product listing
  * Cart page
  * Checkout page

👉 Example: User clicks “Add to Cart”

---

### ⚙️ Backend (Application Layer)

* Built using **Node.js Microservices**
* Handles business logic

👉 Instead of one big app, we split into small services (microservices)

---

### 🗄️ Database Layer

* **Cloud SQL** → Structured data (users, orders, products)
* **FileStore** → File storage (images, product media)

👉 This separation improves performance and scalability

---

# 🔧 3. Microservices Design (Core of the Project)

We break backend into **independent services**:

---

### 👤 User Service

Handles:

* Registration & Login
* Authentication (JWT tokens)
* User profiles

👉 Example:
User logs in → User Service validates credentials

---

### 📦 Product Service

Handles:

* Product catalog
* Pricing
* Inventory

👉 Example:
User searches "iPhone" → Product Service returns list

---

### 🛒 Order Service

Handles:

* Cart management
* Checkout
* Order processing

👉 Example:
User clicks "Place Order" → Order Service processes request

---

### 🔗 Microservices Communication

* REST APIs (HTTP)
* Each service is **independent + loosely coupled**

👉 If Product Service fails → User Service still works

---

# ☁️ 4. DevOps & Cloud Infrastructure

Everything runs on **Google Cloud Platform (GCP)**

---

### 🧱 Infrastructure Setup

| Component    | Tool               |
| ------------ | ------------------ |
| Cloud        | GCP                |
| Kubernetes   | GKE                |
| IaC          | Terraform          |
| CI/CD        | Jenkins            |
| Repo         | GitHub (Quickkart) |
| Project Mgmt | GitHub Kanban      |

---

### 🌍 Real-Time Setup Flow

* Terraform creates:

  * VPC
  * GKE Cluster
  * Load Balancer
* Jenkins automates deployment
* GitHub stores code

👉 *No manual setup → everything automated*

---

# 🐳 5. Containerization & Deployment

### 📦 Docker

* Each microservice packaged as a container

👉 Example:

* user-service → Docker image
* product-service → Docker image

---

### ☸️ Kubernetes (GKE)

* Runs containers
* Handles:

  * Auto scaling
  * Self-healing
  * Load balancing

---

### 📦 Helm

* Used for **Kubernetes deployments**
* Manages configs like:

  * replicas
  * environment variables

---

### 🔁 Deployment Flow

```
Code → Build → Docker Image → Push → Deploy to GKE
```

---

# 🧪 6. Testing & Code Quality

### ✅ Mocha (Automation Testing)

* API testing for microservices

👉 Example:

* Test login API
* Test order API

---

### 📊 SonarQube

* Code quality checks:

  * Bugs
  * Code smells
  * Coverage

👉 Ensures clean & maintainable code

---

### 🔐 Trivy

* Scans Docker images
* Finds vulnerabilities

👉 Prevents deploying insecure images

---

# 📊 7. Monitoring, Logging & Alerting

This is **very critical in production**

---

### 📈 Monitoring Tools

* **GCP Cloud Monitoring** → Infra metrics
* **Prometheus** → Application metrics
* **Grafana** → Dashboards

👉 Example:

* CPU usage
* Pod health
* API response time

---

### 📜 Logging

* **GCP Cloud Logging**
  👉 Stores logs like:
* Errors
* Requests
* Debug info

---

### 🚨 Alerting

* **GCP Alert Policies**

👉 Example:

* CPU > 80% → Alert DevOps team
* Pod crash → Immediate notification

---

# 🔐 8. Security & Secrets Management

---

### 👮 IAM (Identity Access Management)

* Controls access:

  * Who can deploy
  * Who can access cluster

---

### 🔑 Secret Manager

Stores:

* DB passwords
* API keys

👉 No hardcoding in code → secure approach

---

# 🔄 9. End-to-End DevOps Workflow (VERY IMPORTANT)

Let’s understand real pipeline 👇

```
Developer → GitHub → Jenkins → Docker → GCR → GKE → Monitoring
```

### Step-by-Step:

1. Developer writes code
2. Pushes to GitHub (Quickkart repo)
3. Jenkins triggers pipeline
4. Runs:

   * Build
   * Test (Mocha)
   * Code scan (SonarQube)
   * Security scan (Trivy)
5. Docker image created
6. Image pushed to **GCR (Google Container Registry)**
7. Helm deploys app to GKE
8. Monitoring tools track performance

👉 Fully automated CI/CD pipeline 🚀

---

# 🛍️ 10. Real-Time Scenario: User Places an Order

Let’s walk through actual flow 👇

---

### Step 1: User Action (Frontend)

* User opens React app
* Clicks **“Buy Now”**

---

### Step 2: Request Flow

1. Request goes to **Order Service**
2. Order Service calls:

   * User Service → Validate user
   * Product Service → Check stock

---

### Step 3: Database Interaction

* Order stored in **Cloud SQL**
* Product stock updated

---

### Step 4: Response

* Order confirmation sent to user

---

### 🔁 Behind the Scenes

* All services communicate via APIs
* Kubernetes ensures:

  * Scaling
  * High availability

---

### 📊 Monitoring

* Prometheus tracks request
* Grafana shows dashboard
* Alerts triggered if failure

---
