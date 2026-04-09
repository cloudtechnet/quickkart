provider "google" {
  project = "your-project-id"
  region  = "asia-south1"
}

resource "google_container_cluster" "gke" {
  name     = "quickkart-cluster"
  location = "asia-south1"

  initial_node_count = 2
}