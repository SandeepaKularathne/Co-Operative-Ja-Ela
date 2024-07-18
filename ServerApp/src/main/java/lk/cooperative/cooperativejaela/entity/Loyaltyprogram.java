package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Loyaltyprogram {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "level")
    private String level;
    @JsonIgnore
    @OneToMany(mappedBy = "loyaltyprogram")
    private Collection<Customer> customers;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Loyaltyprogram that = (Loyaltyprogram) o;
        return id == that.id && Objects.equals(level, that.level);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, level);
    }

    public Collection<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(Collection<Customer> customers) {
        this.customers = customers;
    }
}
