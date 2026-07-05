# Main E2E scenario

1. Admin logs in at `/admin/login`.
2. Admin creates a category.
3. Admin creates a product.
4. Admin uploads two photos through the product edit page.
5. Admin marks one photo as main.
6. Admin publishes the product with status `IN_STOCK`.
7. Public user sees the product in `/catalog`.
8. Public user sends a lead form.
9. Admin sees the lead in `/admin/leads`.
10. Admin deletes one photo.
11. API deletes the image metadata from PostgreSQL and all image variants from MinIO.
