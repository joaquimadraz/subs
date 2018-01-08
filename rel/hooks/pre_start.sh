#!/bin/bash

echo "Running setup"
# Runs ecto.create, ecto.migrate and ecto.seed
bin/subs command Elixir.Repository.Tasks.ReleaseTasks setup
echo "Setup run successfully"
