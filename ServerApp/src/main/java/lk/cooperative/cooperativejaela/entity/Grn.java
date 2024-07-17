package lk.cooperative.cooperativejaela.entity;

import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Grn {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "date")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private String date;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Basic
    @Column(name = "grandtotal")
    @RegexPattern(reg = "^[0-9]+(\\.[0-9]{1,2})?$", msg = "Invalid price format.")
    private BigDecimal grandtotal;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id", nullable = false)
    private Grnstatus grnstatus;
    @ManyToOne
    @JoinColumn(name = "purorder_id", referencedColumnName = "id", nullable = false)
    private Purorder purorder;
    @OneToMany(mappedBy = "grn",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Grnitem> grnitems;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Grn grn = (Grn) o;
        return id == grn.id && Objects.equals(date, grn.date) && Objects.equals(description, grn.description) && Objects.equals(grandtotal, grn.grandtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, description, grandtotal);
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Grnstatus getGrnstatus() {
        return grnstatus;
    }

    public void setGrnstatus(Grnstatus grnstatus) {
        this.grnstatus = grnstatus;
    }

    public Purorder getPurorder() {
        return purorder;
    }

    public void setPurorder(Purorder purorder) {
        this.purorder = purorder;
    }

    public Collection<Grnitem> getGrnitems() {
        return grnitems;
    }

    public void setGrnitems(Collection<Grnitem> grnitems) {
        this.grnitems = grnitems;
    }
}
