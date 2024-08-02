package lk.cooperative.cooperativejaela.report.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class CountByIncomeShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int year;
    private int month;
    private String shop;
    private BigDecimal tcount;

    // Default constructor
    public CountByIncomeShop() { }

    // Constructor with parameters
    public CountByIncomeShop(int year, int month, String shop, BigDecimal tcount) {
        this.year = year;
        this.month = month;
        this.shop = shop;
        this.tcount = tcount;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getShop() {
        return shop;
    }

    public void setShop(String shop) {
        this.shop = shop;
    }

    public BigDecimal getTcount() {
        return tcount;
    }

    public void setTcount(BigDecimal tcount) {
        this.tcount = tcount;
    }
}
