{
  description = "virtual environments";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { flake-utils, nixpkgs, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system: 
      let
        pkgs = import nixpkgs {
          inherit system;

          overlays = [ devshell.overlays.default ];
        };
      in
      with pkgs; {
        devShells.default = pkgs.devshell.mkShell {
          packages = [ nodejs nodePackages.pnpm nodePackages.prisma postgresql_16 redis ];
          commands = [
            {
              name = "pg:setup";
              category = "database";
              help = "Setup postgres in project folder";
              command = ''
                initdb --encoding=UTF8 --no-locale --no-instructions -U postgres
                echo "listen_addresses = ${"'"}${"'"}" >> $PGDATA/postgresql.conf
                echo "unix_socket_directories = '$PGDATA'" >> $PGDATA/postgresql.conf
                echo "CREATE USER postgres WITH PASSWORD 'password' CREATEDB SUPERUSER;" | postgres --single -E postgres
              '';
            }
            {
              name = "pg:start";
              category = "database";
              help = "Start postgres instance";
              command = ''
                [ ! -d $PGDATA ] && pg:setup
                postgres
              '';
            }
            {
              name = "pg:console";
              category = "database";
              help = "Open database console";
              command = ''
                psql --host $PGDATA s
              '';
            }
          ];
          env = [
            { name = "DATABASE_URL"; eval = "postgresql://postgres:password@localhost/postgres?host=$PRJ_DATA_DIR/postgres"; }
            { name = "PGDATA"; eval = "$PRJ_DATA_DIR/postgres"; }
                        {
              name = "PRISMA_QUERY_ENGINE_BINARY";
              value = "${prisma-engines}/bin/query_engine";
            }
            {
              name = "PRISMA_QUERY_ENGINE_LIBRARY";
              value = "${prisma-engines}/lib/libquery_engine.node";
            }
            {
              name = "PRISMA_SCHEMA_ENGINE_BINARY";
              value = "${pkgs.prisma-engines}/bin/schema-engine";
            }
          ];
        };
      }
    );
}
