<<<<<<< HEAD
provider "google" {
  project = "your-project-id"
  region  = "asia-south1"
}

resource "google_container_cluster" "gke" {
  name     = "quickkart-cluster"
  location = "asia-south1"

  initial_node_count = 2
=======
provider "google" {
  project = "your-project-id"
  region  = "asia-south1"
}

resource "google_container_cluster" "gke" {
  name     = "quickkart-cluster"
  location = "asia-south1"

  initial_node_count = 2
>>>>>>> 364fa4719a5f4ea8ad34d7d78fa2a4a304db08f5
}