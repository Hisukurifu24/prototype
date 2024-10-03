package com.example.SpringEcom.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.SpringEcom.model.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

	@Query("SELECT p FROM Product p WHERE " +
			"LOWER(p.name) LIKE LOWER( CONCAT('%',?1,'%'))" +
			"OR LOWER(p.description) LIKE LOWER( CONCAT('%',?1,'%'))" +
			"OR LOWER(p.brand) LIKE LOWER( CONCAT('%',?1,'%'))" +
			"OR LOWER(p.category) LIKE LOWER( CONCAT('%',?1,'%'))")
	List<Product> searchProducts(String keyword);

}
