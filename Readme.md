# Technical Documentation for RBAC API for Innovation Private Limited

## Overview

This API provides user management functionality with role-based access control (RBAC). It supports user registration, authentication, profile management, and administrative actions for managing users.

### Technology Stack

    Language: Typescript
    Database: MongoDB
    Object Storage: Supabase
    Authentication: JWT

## API Endpoints

### Authentication

    Register (User/Admin):
        POST /api/user/register
        Form fields: name, email?, phone?, password, type?, pfp
    Login:
        POST /api/user/login
        Form fields: email?, phone?, password

### User Endpoints

    Get Current User:
        GET /api/user/current
        Returns: Current logged-in user information
    Update User Name:
        PATCH /api/user/current
        Request body: name
        Returns: 200 No Content
    Update User Profile Picture:
        PUT /api/user/current
        Form fields: pfp
        Returns: 200 OK with message and new image link
    Delete User:
        DELETE /api/user/current
        Returns: 204 No Content

### Admin Endpoints

    Get User by ID:
        GET /api/user/ById/:Id
        Returns: User information for the specified ID
    Update User Name by ID:
        PATCH /api/user/ById/:Id
        Request body: name
        Returns: 200 OK with updated user information
    Update User Profile Picture by ID:
        PUT /api/user/ById/:Id
        Form fields: pfp
        Returns: 200 OK with message and new image link

### Data Storage

    User data is stored in MongoDB using the following schema:
        name: string
        email?: string
        phone?: number
        password: string
        imageUrl: string (Supabase object storage URL)
        type: string (user or admin)
        createdAt: Date
        updatedAt: Date
    Profile pictures are stored in Supabase object storage.

### Authentication

    JWT is used for authentication.

### Error Handling

    The API returns appropriate HTTP status codes for errors.

### Additional Information

    The API supports both user and admin roles.
    Only admins can access the endpoints for managing other users.
    Passwords are stored securely using a hashing algorithm.